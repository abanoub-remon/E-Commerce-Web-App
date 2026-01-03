from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.response import Response
from .serializers import RegisterSerializer, CustomTokenObtainPairSerializer, CustomLoginSerializer, UserProfileSerializer, AdminUserSerializer
from django.utils.http import urlsafe_base64_decode
from django.utils.encoding import force_str
from django.contrib.auth import get_user_model
from rest_framework.views import APIView
import urllib.parse
from .utils import send_activation_email, generate_activation_token, generate_token, send_reset_password_email
from .models import User
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django.utils import timezone
from datetime import timedelta
from rest_framework.parsers import MultiPartParser, FormParser


class RegisterView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.save()
        user.is_active = False
        user.activation_token = generate_activation_token()
        user.activation_token_created_at = timezone.now()
        user.save()

        send_activation_email(user)

        return Response(
            {"message": "Account created successfully. Please check your email to activate your account."},
            status=status.HTTP_201_CREATED
        )


class ActivateAccountView(APIView):
    def get(self, request, token):
        try:
            user = User.objects.get(activation_token=token)
        except User.DoesNotExist:
            return Response(
                {"message": "Account already activated or invalid link."},
                status=status.HTTP_200_OK,
            )

        if timezone.now() - user.activation_token_created_at > timedelta(hours=24):
            return Response(
                {"detail": "Activation link has expired."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user.is_active = True
        user.activation_token = None
        user.activation_token_created_at = None
        user.save()

        return Response(
            {"message": "Account activated successfully."},
            status=status.HTTP_200_OK,
        )

class CustomTokenObtainView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


class CustomLoginView(APIView):
    def post(self, request):
        serializer = CustomLoginSerializer(
            data=request.data,
            context={"request": request}
        )
        serializer.is_valid(raise_exception=True)
        return Response(serializer.validated_data)

class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get(self, request):
        serializer = UserProfileSerializer(
            request.user,
            context={"request": request}
        )
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request):
        user = request.user
        if "profile_image" in request.FILES:
            user.profile_image = request.FILES["profile_image"]
            serializer = UserProfileSerializer(
            user,
            data=request.data,
            partial=True,
            context={"request": request}
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        user = request.user

        return Response(serializer.data, status=status.HTTP_200_OK)

class ForgotPasswordView(APIView):
    def post(self, request):
        email = request.data.get("email")

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response(
                {"message": "If this email exists, a reset link has been sent."},
                status=status.HTTP_200_OK,
            )
        token = generate_token()
        user.reset_password_token = token
        user.reset_password_created_at = timezone.now()
        user.save()
        
        print("FINAL TOKEN SAVED:", token)
        
        send_reset_password_email(user)

        return Response(
            {"message": "If this email exists, a reset link has been sent."},
            status=status.HTTP_200_OK,
        )

class ResetPasswordView(APIView):
    def post(self, request, token):
        password = request.data.get("password")
        confirm_password = request.data.get("confirm_password")

        if password != confirm_password:
            return Response(
                {"detail": "Passwords do not match."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            user = User.objects.get(reset_password_token=token)
        except User.DoesNotExist:
            return Response(
                {"detail": "Invalid or expired reset link."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if (
            timezone.now() - user.reset_password_created_at
            > timedelta(hours=24)
        ):
            return Response(
                {"detail": "Reset link has expired."},
                status=status.HTTP_400_BAD_REQUEST,
            )


        user.set_password(password)
        user.reset_password_token = None
        user.reset_password_created_at = None
        user.save()

        return Response({"message": "Password reset successfully."})

class ResendActivationView(APIView):
    def post(self, request):
        email = request.data.get("email")

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response(
                {"message": "If this email exists, an activation link has been sent."},
                status=status.HTTP_200_OK,
            )

        if user.is_active:
            return Response(
                {"message": "Account is already activated."},
                status=status.HTTP_200_OK,
            )

        user.activation_token = generate_activation_token()
        user.activation_token_created_at = timezone.now()
        user.save()

        send_activation_email(user)

        return Response(
            {"message": "If this email exists, an activation link has been sent."},
            status=status.HTTP_200_OK,
        )

class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        old_password = request.data.get("old_password")
        new_password = request.data.get("new_password")
        confirm = request.data.get("confirm_password")

        if new_password != confirm:
            return Response(
                {"detail": "Passwords do not match."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not request.user.check_password(old_password):
            return Response(
                {"detail": "Old password is incorrect."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        request.user.set_password(new_password)
        request.user.save()

        return Response(
            {"message": "Password changed successfully."},
            status=status.HTTP_200_OK,
        )

class AdminUsersView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        users = User.objects.filter(is_staff=False).order_by("-date_joined")
        serializer = AdminUserSerializer(users, many=True)
        return Response(serializer.data)

class AdminToggleUserView(APIView):
    permission_classes = [IsAdminUser]

    def put(self, request, user_id):
        user = User.objects.get(id=user_id)

        field = request.data.get("field")
        value = request.data.get("value")

        if field not in ["is_active", "is_seller"]:
            return Response({"detail": "Invalid field"}, status=400)

        setattr(user, field, value)
        user.save()

        return Response({"detail": "User updated"})
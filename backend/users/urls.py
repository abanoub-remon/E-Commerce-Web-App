from django.urls import path
from .views import (
RegisterView,
ActivateAccountView,
CustomLoginView,
CustomTokenObtainView,
UserProfileView,
ForgotPasswordView,
ResetPasswordView,
ResendActivationView,
ChangePasswordView,
AdminUsersView,
AdminToggleUserView,
)
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('activate/<str:token>/', ActivateAccountView.as_view()),
    path('login/', CustomLoginView.as_view(), name='login'),
    path('token/', CustomTokenObtainView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path("profile/", UserProfileView.as_view(), name="user-profile"),
    path("forgot-password/", ForgotPasswordView.as_view()),
    path("reset-pass/<str:token>/", ResetPasswordView.as_view()),
    path("resend-activation/", ResendActivationView.as_view()),
    path("change-password/", ChangePasswordView.as_view()),
    path("admin/users/", AdminUsersView.as_view()),
    path("admin/users/<int:user_id>/toggle/", AdminToggleUserView.as_view()),
]

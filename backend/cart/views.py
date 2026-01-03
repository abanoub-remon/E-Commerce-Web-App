from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Cart, CartItem
from products.models import Product
from rest_framework import status
from .serializers import CartItemSerializer

class SyncCartView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        cart, _ = Cart.objects.get_or_create(user=request.user)

        for item in request.data.get("items", []):
            product = Product.objects.get(id=item["product_id"])
            cart_item, created = CartItem.objects.get_or_create(
                cart=cart,
                product=product
            )

            if created:
                cart_item.quantity = item["quantity"]
            else:
                cart_item.quantity += item["quantity"]

            cart_item.save()

        return Response({"detail": "Cart synced"})

class CartView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        cart, _ = Cart.objects.get_or_create(user=request.user)
        serializer = CartItemSerializer(cart.items.all(), many=True, context={"request": request})
        return Response(serializer.data)

    def post(self, request):
        cart, _ = Cart.objects.get_or_create(user=request.user)
        product = Product.objects.get(id=request.data["product_id"])

        item, created = CartItem.objects.get_or_create(
            cart=cart,
            product=product
        )

        if not created:
            item.quantity += 1
        item.save()

        return Response({"detail": "Item added"})



class CartItemDeleteView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, item_id):
        item = CartItem.objects.get(id=item_id, cart__user=request.user)
        item.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class CartItemUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, item_id):
        item = CartItem.objects.get(id=item_id, cart__user=request.user)
        item.quantity = request.data["quantity"]
        item.save()
        return Response({"detail": "Updated"})

class CartCountView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        cart, _ = Cart.objects.get_or_create(user=request.user)
        count = sum(item.quantity for item in cart.items.all())
        return Response({"count": count})
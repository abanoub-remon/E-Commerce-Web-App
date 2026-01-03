from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework import status
from cart.models import Cart, CartItem
from .models import Order, OrderItem
from .serializers import OrderSerializer, SellerOrderSerializer
from django.db.models import Sum, Count
from users.models import User
from products.models import Product

class CreateOrderView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        cart = Cart.objects.get(user=request.user)
        cart_items = cart.items.all()

        if not cart_items.exists():
            return Response(
                {"detail": "Cart is empty"},
                status=status.HTTP_400_BAD_REQUEST
            )

        total = sum(
            item.product.final_price() * item.quantity
            for item in cart_items
        )

        order = Order.objects.create(
            user=request.user,
            full_name=request.data["full_name"],
            address=request.data["address"],
            city=request.data["city"],
            phone=request.data["phone"],
            payment_method=request.data["payment_method"],
            total_price=total
        )

        for item in cart_items:
            OrderItem.objects.create(
                order=order,
                product=item.product,
                seller=item.product.seller,
                quantity=item.quantity,
                price=item.product.final_price()
            )

        cart_items.delete()

        return Response(
            {"detail": "Order created", "order_id": order.id},
            status=status.HTTP_201_CREATED
        )

class UserOrdersView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        orders = Order.objects.filter(user=request.user).order_by("-created_at")
        serializer = OrderSerializer(orders, many=True, context={"request": request})
        return Response(serializer.data)

class SellerOrdersView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if not request.user.is_seller:
            return Response([], status=403)

        orders = (
            Order.objects
            .filter(items__seller=request.user)
            .distinct()
            .order_by("-created_at")
        )

        serializer = SellerOrderSerializer(
            orders,
            many=True,
            context={"request": request}
        )
        return Response(serializer.data)

class UpdateOrderStatusView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, order_id):
        if not request.user.is_seller:
            return Response(status=403)

        order = Order.objects.get(id=order_id)

        new_status = request.data.get("status")
        if new_status not in ["PROCESSING", "SHIPPED", "DELIVERED"]:
            return Response(status=400)

        order.status = new_status
        order.save()

        return Response({"detail": "Status updated"})

class AdminOrdersView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        orders = Order.objects.all().order_by("-created_at")
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)

class AdminUpdateOrderStatusView(APIView):
    permission_classes = [IsAdminUser]

    def put(self, request, order_id):
        order = Order.objects.get(id=order_id)

        new_status = request.data.get("status")
        if new_status == "processing" and not order.stock_deducted:
            with transaction.atomic():
                for item in order.items.all():
                    product = item.product

                    if product.stock_quantity < item.quantity:
                        return Response(
                            {"detail": f"Not enough stock for {product.title}"},
                            status=400
                        )

                    product.stock_quantity -= item.quantity
                    product.save()

                order.stock_deducted = True

        order.status = new_status
        order.save()

        return Response({"detail": "Order status updated"})


class AdminAnalyticsView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        total_users = User.objects.filter(is_staff=False).count()
        total_orders = Order.objects.count()
        total_products = Product.objects.count()

        total_revenue = (
            Order.objects.aggregate(total=Sum("total_price"))["total"] or 0
        )

        best_product = (
            OrderItem.objects
            .values("product__title")
            .annotate(total_sold=Sum("quantity"))
            .order_by("-total_sold")
            .first()
        )

        return Response({
            "total_users": total_users,
            "total_orders": total_orders,
            "total_products": total_products,
            "total_revenue": total_revenue,
            "best_product": best_product,
        })

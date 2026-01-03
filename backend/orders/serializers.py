from rest_framework import serializers
from .models import Order, OrderItem

class OrderItemSerializer(serializers.ModelSerializer):
    product_title = serializers.CharField(source="product.title", read_only=True)
    image = serializers.SerializerMethodField()

    class Meta:
        model = OrderItem
        fields = (
            "id",
            "product",
            "product_title",
            "quantity",
            "price",
            "image",
        )

    def get_image(self, obj):
        request = self.context.get("request")

        first_image = obj.product.images.first() if obj.product else None
        if first_image and first_image.image:
            url = first_image.image.url
            return request.build_absolute_uri(url) if request else url

        return None



class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = (
            "id",
            "full_name",
            "address",
            "city",
            "phone",
            "payment_method",
            "status",
            "total_price",
            "created_at",
            "items",
        )

class SellerOrderItemSerializer(serializers.ModelSerializer):
    product_title = serializers.CharField(source="product.title", read_only=True)

    class Meta:
        model = OrderItem
        fields = (
            "id",
            "product_title",
            "quantity",
            "price",
        )

class SellerOrderSerializer(serializers.ModelSerializer):
    items = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = (
            "id",
            "status",
            "created_at",
            "full_name",
            "items",
        )

    def get_items(self, obj):
        seller = self.context["request"].user
        items = obj.items.filter(seller=seller)
        return SellerOrderItemSerializer(items, many=True).data
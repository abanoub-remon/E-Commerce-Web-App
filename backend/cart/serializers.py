from rest_framework import serializers
from .models import Cart, CartItem

class CartItemSerializer(serializers.ModelSerializer):
    product_title = serializers.CharField(source="product.title", read_only=True)
    price = serializers.DecimalField(
        source="product.final_price",
        max_digits=10,
        decimal_places=2,
        read_only=True
    )
    image = serializers.SerializerMethodField()

    class Meta:
        model = CartItem
        fields = (
            "id",
            "product",
            "product_title",
            "price",
            "quantity",
            "image",
        )

    def get_image(self, obj):
        request = self.context.get("request")
        img = obj.product.images.first()

        if img and request:
            return request.build_absolute_uri(img.image.url)


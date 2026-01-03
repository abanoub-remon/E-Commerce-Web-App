import django_filters
from .models import Product

class ProductFilter(django_filters.FilterSet):
    category = django_filters.NumberFilter(field_name="category__id")
    brand = django_filters.NumberFilter(field_name="brand__id")
    tag = django_filters.NumberFilter(field_name="tags__id")

    min_price = django_filters.NumberFilter(field_name="price", lookup_expr="gte")
    max_price = django_filters.NumberFilter(field_name="price", lookup_expr="lte")

    class Meta:
        model = Product
        fields = [
            "category",
            "brand",
            "tag",
            "min_price",
            "max_price",
        ]

from django.shortcuts import render
from rest_framework import generics, permissions, status
from .models import Product, Category, Brand, Tag, ProductImage, Review, Wishlist
from .serializers import (
    ProductSerializer,
    CategorySerializer,
    BrandSerializer,
    TagSerializer,
    ReviewSerializer,
    WishlistSerializer,
)
from .permissions import IsSellerOrReadOnly
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from .filters import ProductFilter
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.exceptions import PermissionDenied
from django.db.models import Sum
from orders.models import OrderItem

class ProductListCreateView(generics.ListCreateAPIView):
    queryset = Product.objects.filter(is_approved=True).order_by("-created_at")
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    filter_backends = [
        DjangoFilterBackend,
        SearchFilter,
        OrderingFilter,
    ]
    filterset_class = ProductFilter

    search_fields = [
        "title",
        "description",
        "brand__name",
    ]

    ordering_fields = [
        "price",
        "created_at",
    ]

    def perform_create(self, serializer):
        if not self.request.user.is_seller:
            raise PermissionDenied("Only sellers can create products.")
        if not self.request.user.is_seller or not self.request.user.is_seller_approved:
            raise PermissionDenied("Seller not approved yet.")

        serializer.save(seller=self.request.user)


class ProductDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Product.objects.filter(is_approved=True)
    serializer_class = ProductSerializer

class RelatedProductsView(generics.ListAPIView):
    serializer_class = ProductSerializer

    def get_queryset(self):
        product_id = self.kwargs["pk"]
        product = Product.objects.get(id=product_id)

        return Product.objects.filter(
            category=product.category
        ).exclude(id=product_id)[:4]


class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class BrandListView(generics.ListAPIView):
    queryset = Brand.objects.all()
    serializer_class = BrandSerializer


class TagListView(generics.ListAPIView):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer

class ProductImageUploadView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, product_id):
        product = Product.objects.get(id=product_id)

        if product.seller != request.user:
            return Response(
                {"detail": "Not allowed"},
                status=status.HTTP_403_FORBIDDEN
            )

        images = request.FILES.getlist("images")

        for image in images:
            ProductImage.objects.create(
                product=product,
                image=image
            )

        return Response(
            {"message": "Images uploaded successfully"},
            status=status.HTTP_201_CREATED
        )

class AddReviewView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, product_id):
        rating = request.data.get("rating")
        comment = request.data.get("comment", "")

        if not rating or int(rating) not in [1, 2, 3, 4, 5]:
            return Response(
                {"detail": "Rating must be between 1 and 5."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        product = Product.objects.get(id=product_id)

        if Review.objects.filter(product=product, user=request.user).exists():
            return Response(
                {"detail": "You already reviewed this product."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        review = Review.objects.create(
            product=product,
            user=request.user,
            rating=rating,
            comment=comment,
        )

        serializer = ReviewSerializer(review)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class SellerProductsView(generics.ListAPIView):
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Product.objects.filter(seller=self.request.user).order_by("-created_at")

class DeleteProductImageView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, image_id):
        try:
            image = ProductImage.objects.get(id=image_id)
        except ProductImage.DoesNotExist:
            return Response(
                {"detail": "Image not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        if image.product.seller != request.user:
            return Response(
                {"detail": "Not allowed"},
                status=status.HTTP_403_FORBIDDEN
            )

        image.delete()
        return Response(
            {"message": "Image deleted"},
            status=status.HTTP_204_NO_CONTENT
        )

class FeaturedProductsView(APIView):
    def get(self, request):
        products = Product.objects.filter(is_featured=True, is_approved=True)[:8]
        serializer = ProductSerializer(products, many=True, context={"request": request})
        return Response(serializer.data)

class LatestProductsView(APIView):
    def get(self, request):
        products = (
            Product.objects
            .filter(is_approved=True)
            .order_by("-created_at")[:8]
        )
        serializer = ProductSerializer(products, many=True, context={"request": request})
        return Response(serializer.data)

class BestSellerProductsView(APIView):
    def get(self, request):
        product_ids = (
            OrderItem.objects
            .values("product")
            .annotate(total=Sum("quantity"))
            .order_by("-total")[:8]
        )

        ids = [p["product"] for p in product_ids]
        products = Product.objects.filter(id__in=ids, is_approved=True)
        serializer = ProductSerializer(products, many=True, context={"request": request})
        return Response(serializer.data)

class FeaturedCategoriesView(APIView):
    def get(self, request):
        category_sales = (
            OrderItem.objects
            .values("product__category")
            .annotate(total_sold=Sum("quantity"))
            .order_by("-total_sold")[:6]
        )

        category_ids = [
            item["product__category"]
            for item in category_sales
            if item["product__category"] is not None
        ]

        categories = Category.objects.filter(id__in=category_ids)

        serializer = CategorySerializer(categories, many=True , context={"request": request})
        return Response(serializer.data)

class AdminProductsView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        products = Product.objects.select_related("seller").order_by("-created_at")
        serializer = ProductSerializer(
            products,
            many=True,
            context={"request": request}
        )
        return Response(serializer.data)

class ApproveRejectProductView(APIView):
    permission_classes = [IsAdminUser]

    def put(self, request, product_id):
        product = Product.objects.get(id=product_id)

        action = request.data.get("action")
        if action == "approve":
            product.is_approved = True
        elif action == "reject":
            product.is_approved = False
        elif action == "unfeature":
            product.is_featured = False
        elif action == "feature":
            product.is_featured = True
        else:
            return Response({"detail": "Invalid action"}, status=400)

        product.save()
        return Response({"detail": "Product updated"})

class AdminCategoriesView(APIView):
    permission_classes = [IsAdminUser]
    parser_classes = [MultiPartParser, FormParser]

    def get(self, request):
        categories = Category.objects.all().order_by("name")
        serializer = CategorySerializer(
            categories, many=True, context={"request": request}
        )
        return Response(serializer.data)

    def post(self, request):
        serializer = CategorySerializer(
            data=request.data, context={"request": request}
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=201)

class AdminDeleteCategoryView(APIView):
    permission_classes = [IsAdminUser]

    def delete(self, request, category_id):
        Category.objects.filter(id=category_id).delete()
        return Response(status=204)

class AdminTagsView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        tags = Tag.objects.all().order_by("name")
        serializer = TagSerializer(tags, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = TagSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=201)

class AdminDeleteTagView(APIView):
    permission_classes = [IsAdminUser]

    def delete(self, request, tag_id):
        Tag.objects.filter(id=tag_id).delete()
        return Response(status=204)

class AdminUpdateCategoryView(APIView):
    permission_classes = [IsAdminUser]
    parser_classes = [MultiPartParser, FormParser]

    def put(self, request, category_id):
        category = Category.objects.get(id=category_id)
        serializer = CategorySerializer(
            category,
            data=request.data,
            partial=True,
            context={"request": request}
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

class WishlistView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        items = Wishlist.objects.filter(user=request.user).select_related("product")
        serializer = WishlistSerializer(items, many=True, context={"request": request})
        return Response(serializer.data)

    def post(self, request):
        product_id = request.data.get("product_id")
        if not product_id:
            return Response({"detail": "product_id is required"}, status=400)

        Wishlist.objects.get_or_create(
            user=request.user,
            product_id=product_id
        )
        return Response({"detail": "Added to wishlist"}, status=status.HTTP_201_CREATED)

class WishlistRemoveView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, product_id):
        Wishlist.objects.filter(
            user=request.user,
            product_id=product_id
        ).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
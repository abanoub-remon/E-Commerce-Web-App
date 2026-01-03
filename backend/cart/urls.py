from django.urls import path
from .views import SyncCartView, CartView, CartItemDeleteView, CartItemUpdateView, CartCountView


urlpatterns = [
  path("cart/", CartView.as_view()),
  path("cart/sync/", SyncCartView.as_view()),
  path("cart/item/<int:item_id>/", CartItemDeleteView.as_view()),
  path("cart/item/<int:item_id>/update/", CartItemUpdateView.as_view()),
  path("cart/count/", CartCountView.as_view()),
]
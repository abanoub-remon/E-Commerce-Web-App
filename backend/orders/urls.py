from django.urls import path
from .views import (
  CreateOrderView,
  UserOrdersView,
  SellerOrdersView,
  UpdateOrderStatusView,
  AdminOrdersView,
  AdminUpdateOrderStatusView,
  AdminAnalyticsView,
  ) 

urlpatterns = [
    path("orders/create/", CreateOrderView.as_view()),
    path("orders/", UserOrdersView.as_view()),
    path("seller/orders/", SellerOrdersView.as_view()),
    path("seller/orders/<int:order_id>/status/", UpdateOrderStatusView.as_view()),
    path("admin/orders/", AdminOrdersView.as_view()),
    path("admin/orders/<int:order_id>/status/", AdminUpdateOrderStatusView.as_view()),
    path("admin/analytics/", AdminAnalyticsView.as_view()),
    
]

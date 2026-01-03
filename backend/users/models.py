from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone

class User(AbstractUser):
    email = models.EmailField(max_length=254, unique=True)
    phone = models.CharField(max_length=20)
    profile_image = models.ImageField(upload_to='profiles/', null=True, blank=True)
    address = models.CharField(max_length=255, blank=True, null=True)
    city = models.CharField(max_length=100, blank=True)
    country = models.CharField(max_length=100, blank=True)
    birthdate = models.DateField(null=True, blank=True)
    activation_token = models.CharField(
        max_length=255,
        blank=True,
        null=True
    )
    activation_token_created_at = models.DateTimeField(null=True, blank=True)
    is_seller = models.BooleanField(default=False)
    is_seller_approved = models.BooleanField(default=True)
    is_active = models.BooleanField(default=False)
    reset_password_token = models.CharField(max_length=255, null=True, blank=True)
    reset_password_created_at = models.DateTimeField(null=True, blank=True)
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.email

from django.core.mail import send_mail
from django.urls import reverse
from django.conf import settings
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
import secrets

def generate_activation_token():
    return secrets.token_urlsafe(32)

def send_activation_email(user):
    activation_link = f"http://localhost:5173/activate/{user.activation_token}"

    subject = "Activate your account"
    message = f"""
Hi {user.first_name},

Please activate your account by clicking the link below:

{activation_link}

This link is valid for 24 hours.
"""

    send_mail(
        subject,
        message,
        settings.DEFAULT_FROM_EMAIL,
        [user.email],
        fail_silently=False,
    )

def generate_token():
    return secrets.token_urlsafe(32)

def send_reset_password_email(user):
    reset_link = f"http://localhost:5173/reset-pass/{user.reset_password_token}"

    subject = "Reset your password"
    message = f"""
Hi {user.first_name},

Click the link below to reset your password:
{reset_link}

This link is valid for 24 hours.
"""

    send_mail(
        subject,
        message,
        settings.DEFAULT_FROM_EMAIL,
        [user.email],
        fail_silently=False,
    )
from django.contrib.auth.models import User
from rest_framework.serializers import ValidationError


def validate_email(email):
   if User.objects.filter(email=email).exists():
      raise ValidationError('This email is already registered.')
   return email

def validate_username(username):
   if User.objects.filter(username=username).exists():
      raise ValidationError('This username is already registered.')
   return username
from django.http import JsonResponse
from allauth.socialaccount.models import SocialToken, SocialApp
from django.views.decorators.csrf import csrf_exempt
import requests


from django.http import JsonResponse
from allauth.socialaccount.models import SocialToken, SocialApp
from django.views.decorators.csrf import csrf_exempt
import requests

@csrf_exempt
def MicrosoftOneNote(request, socialMicrosoftTokenId, calendar_id, event_id):
    socialToken = SocialToken.objects.get(id=socialMicrosoftTokenId)
   
    if socialToken:
        access_token = socialToken.token

      
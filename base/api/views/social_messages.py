from django.http import JsonResponse
from allauth.socialaccount.models import SocialToken, SocialApp
import datetime
from django.utils import timezone

from ...utils import  get_email_text, get_header_value
from ...services.google import google_calendar, google_todos , google_gmail, google_youtube
from ...services.github import github_notifications
from ...services.facebook import notifications as facebook_notifications

from ...services.microsoft import (microsoft_events, 
                                                        microsoft_mails, 
                                                        microsoft_onenotes, 
                                                        microsoft_todos)

def messages_list(request):
    messages_list = []
    services = dict()

    providers = ['google', 'github', 'facebook', 'microsoft']

    for provider in providers:
        socialTokens = SocialToken.objects.filter(
            account__user=request.user, 
            account__provider=provider
        )

        for socialToken in socialTokens:
            if socialToken.expires_at < timezone.now() - datetime.timedelta(minutes=50):
                break

            access_token = socialToken.token
            access_email = socialToken.account.extra_data.get('email', None)

            if provider == 'google':
                response = google_gmail.GoogleGmailService(access_token,  socialToken.id, get_email_text, get_header_value, access_email)
                
                if response[0] == 'success':
                    data = sorted(response[0], key=lambda event: event['created_time'])
                    messages_list.extend(data)
                    services.update({'Gmail': data})
                    
                response = google_todos.GoogleTodoService(access_token, socialToken.id, access_email)
                
                if response[0] == 'success':
                    data = sorted(response[0], key=lambda event: event['created_time'])
                    messages_list.extend(data)
                    services.update({'Google_Todo': data})
                    
                response = google_calendar.CallendarService(access_token, socialToken.id, access_email)

                if response[0] == 'success':
                    data = sorted(response[0], key=lambda event: event['created_time'])
                    messages_list.extend(data)
                    services.update({'Google_Event': data})
                # response = google_youtube.GoogleYoutubeService(access_token, socialToken.id, access_email)




    

    
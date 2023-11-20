from django.http import JsonResponse
from allauth.socialaccount.models import SocialToken, SocialApp
from django.utils import timezone
from django.conf import settings

import datetime
import requests
import base64

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

    included_services = [
        {
           "provider": "google",
            "services": {
                "Gmail": google_gmail.GoogleGmailService,
                "Google_Todo": google_todos.GoogleTodoService,
                "Google_Event": google_calendar.CallendarService,
                "YouTube": google_youtube.GoogleYoutubeService,
            },
        }, 
        {
            "provider": "microsoft",
            "services": {
                "Microsoft_Mails": microsoft_mails.MicrosoftMailsService,
                "Microsoft_Todo": microsoft_todos.MicrosoftTodoService,
                "Microsoft_Calendar": microsoft_events.MicrosoftCalendarService,
                "Microsoft_OneNote": microsoft_onenotes.MicrosoftOneNotesService,
            }
        }
    ]

    for provider in providers:
        socialTokens = SocialToken.objects.filter(
            account__user=request.user, 
            account__provider=provider
        )

        for socialToken in socialTokens:
            if socialToken.expires_at < timezone.now() - datetime.timedelta(minutes=settings.SOCIALTOKEN_LIFETIME):
                if socialToken.account.provider == 'google':
                    # TODO: Google token rewriting
                    response = requests.post("https://www.googleapis.com/oauth2/v4/token", headers={
                        "Authorization": "Basic " + base64.b64encode(f"{settings.SOCIALACCOUNT_PROVIDERS['google']['APP']['client_id']}:{settings.SOCIALACCOUNT_PROVIDERS['google']['APP']['secret']}".encode("utf-8")).decode("utf-8"),
                    }, data={
                        "grant_type": "refresh_token",
                        "refresh_token": socialToken.token_secret,
                    })
                    if response.status_code == 200:
                        response_json = response.json()
                        socialToken.token = response_json["access_token"]
                        socialToken.save()
                else:
                    break

            access_token = socialToken.token
            access_email = socialToken.account.extra_data.get('email', None)

            for provider_info in included_services:
                provider_name = provider_info["provider"]
                
                if provider_name == provider:
                    provider_services = provider_info["services"]

                    for service_name, service_class in provider_services.items():
                        response = service_class(access_token, socialToken.id, access_email)


                        if response[0] == "success":
                            data = sorted(response[1], key=lambda event: event["created_time"])
                            messages_list.extend(data)

                            if service_name in services:
                                existing_data = services[service_name]
                                updated_data = sorted(existing_data + data, key=lambda event: event["created_time"])
                                services[service_name] = updated_data
                            else:
                                services[service_name] = sorted(data, key=lambda event: event["created_time"])
                    break
                else:
                    continue

    return JsonResponse({
        "messages": messages_list,
        "services": services,
    }, status=200)

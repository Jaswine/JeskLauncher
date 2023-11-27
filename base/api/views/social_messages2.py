from django.http import JsonResponse
from allauth.socialaccount.models import SocialToken
from django.utils import timezone
from django.conf import settings

from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.views import View

import datetime
import requests
import base64
import threading

from ...services.google import google_calendar, google_todos , google_gmail, google_youtube
from ...services.microsoft import (microsoft_events, 
                                                        microsoft_mails, 
                                                        microsoft_onenotes, 
                                                        microsoft_todos)

class MessagesListView(View):
    def refresh_google_token(self, socialToken):
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
            return ''
        
    def get_messages_from_service(self, service_name, service_class, access_token,
                                                             socialToken, access_email, message_list, services):
        response = service_class(access_token, socialToken.id, access_email)

        if response[0] == "success":
            data = sorted(response[1], key=lambda event: event["created_time"])
            message_list.extend(data)

            if service_name in services:
                existing_data = services[service_name]
                updated_data = sorted(existing_data + data, key=lambda event: event["created_time"])
                services[service_name] = updated_data
            else:
                services[service_name] = sorted(data, key=lambda event: event["created_time"])
        
    def show_messages_from_provider(self, user, provider, included_services, message_list, services):
        socialTokens = SocialToken.objects.filter(
            account__user=user, 
            account__provider=provider
        )

        threads = []
        for socialToken in socialTokens:
            if socialToken.expires_at < timezone.now() - datetime.timedelta(minutes=settings.SOCIALTOKEN_LIFETIME):
                if socialToken.account.provider == 'google':
                    # TODO: Google token rewriting
                    self.refresh_google_token(socialToken)
                else:
                    continue

            access_token = socialToken.token
            access_email = socialToken.account.extra_data.get('email', None)

            for provider_info in included_services:
                provider_name = provider_info["provider"]

                if provider_name == provider:
                    provider_services = provider_info["services"]

                    for service_name, service_class in provider_services.items():
                        thread = threading.Thread(target=self.get_messages_from_service, args=(service_name, service_class, access_token, 
                                                                                            socialToken, access_email, message_list, services))
                        thread.start()
                        threads.append(thread)
                    break
                else:
                    continue
            
        for thread in threads:
            thread.join()

    def get(self, request, *args, **kwargs):
        message_list = []
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

        # Создаем список функций для взятия данных с API
        provider_functions = []
        for provider in providers:
            provider_functions.append(self.show_messages_from_provider(request.user, provider, included_services, message_list, services))

        # Запускаем функции параллельно
        provider_threads = []
        for function in provider_functions:
            thread = threading.Thread(target=function)
            thread.start()
            provider_threads.append(thread)

        # Ждем завершения всех функций
        for thread in provider_threads:
            thread.join()

        # Обрабатываем полученные данные
        for function in provider_functions:
            # data = function()
            print('\n\n\n DATA: ', 'Get successfully!!')

        return JsonResponse({
            "messages": message_list,
            "services": services,
        }, status=200)
    
    if __name__ == '__main__':
        get()
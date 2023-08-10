from django.http import JsonResponse
from allauth.socialaccount.models import SocialToken, SocialApp
import requests

from ...utils import  get_email_text, get_header_value
from ...services.google import google_calendar, google_todos , google_gmail, google_youtube


def messages_list(request):
    email_list = []
    included_apps = []
    # socialApp = SocialApp.objects.get(provider='google')
    
    socialGoogleToken = SocialToken.objects.filter(account__user=request.user, account__provider='google').last()
    # print(f'______________{socialGoogleToken}_____________')
    if socialGoogleToken:
        access_token = socialGoogleToken.token
        
        print('\n _______________ messages loading _____________\n')
        
        # CALLENDAR GOOGLE
        google_calendar.CallendarService(email_list, access_token, included_apps)
            
        #GOOGLE TASKS
        google_todos.GoogleTodoService(email_list, access_token, included_apps)

        # GOOGLE GMAIL
        google_gmail.GoogleGmailService(email_list, access_token, get_email_text, get_header_value, included_apps)
        
        # GOOGLE YOUTUBE
        google_youtube.GoogleYoutubeService(email_list, access_token, included_apps)
        
        print('__________ included_apps ___________', included_apps)
        
        if len(email_list) > 0:
            data = [{
                    'id': message['id'],
                    'type': message['type'],
                    'title': message['title'],
                    'sender': message['sender'],
                    'link': message['link'],
                    'text': message['text'],
                    'created_time': str(message['created_time']),
    
                    'list_id': message.get('list_id', ''),
                    'status': message.get('status', ''),
                } for message in email_list]
                            
            data = sorted(data, key=lambda x: x['created_time'])
            
            return JsonResponse({
                'status':'success',
                'included_apps': [],
                'messages': data[::-1],
            }, safe=False)
            
        return JsonResponse({
            'status': 'error',
            'message': 'token not valid, sign out and sign in again'
        }, safe=False)
            
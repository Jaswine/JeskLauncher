from django.http import JsonResponse
from allauth.socialaccount.models import SocialToken, SocialApp
import requests

from ...utils import  get_email_text, get_header_value
from ...services.google import google_calendar, google_todos , google_gmail, google_youtube


def messages_list(request):
    email_list = []
    included_apps = []
    
    google_calendar_messages = []  # Initialize the variables
    google_todos_messages = []
    google_gmail_messages = []
    google_youtube_messages = []

    filter = []
    # socialApp = SocialApp.objects.get(provider='google')
    
    filter_get = request.GET.get('filter')
    
    if filter_get:
        filter = filter_get.split(',') 
        print(filter)   
            
    socialGoogleToken = SocialToken.objects.filter(account__user=request.user, account__provider='google').last()
    if socialGoogleToken:
        access_token = socialGoogleToken.token
        
        print(filter)

        # # CALLENDAR GOOGLE        
        if 'Google_Event' in filter:   
            google_calendar_messages = google_calendar.CallendarService(email_list, access_token, included_apps)

        # # GOOGLE TASKS        
        if 'Google_Todo' in filter:
            google_todos_messages = google_todos.GoogleTodoService(email_list, access_token, included_apps)

        # # GOOGLE GMAIL
        if 'Gmail' in filter:
            google_gmail_messages = google_gmail.GoogleGmailService(email_list, access_token, get_email_text, get_header_value, included_apps)
        
        # # GOOGLE YOUTUBE
        if 'YouTube' in filter:
            google_youtube_messages = google_youtube.GoogleYoutubeService(email_list, access_token, included_apps)
        
        if len(email_list) > 0:
            data = [{
                    'id': message['id'],
                    'type': message['type'],
                    'title': message['title'],
                    'sender': message['sender'],
                    'thumbnail': message.get('thumbnail', ''),
                    'link': message['link'],
                    'text': message['text'],
                    'created_time': str(message['created_time']),
    
                    'list_id': message.get('list_id', ''),
                    'calendar_id': message.get('calendar_id', ''),
                    
                    'status': message.get('status', ''),
                } for message in email_list]
                            
            data = sorted(data, key=lambda x: x['created_time'])
            
            # print(f'\n\n{google_calendar_messages}\n\n')
            if google_calendar_messages: 
                google_calendar_messages = sorted(google_calendar_messages, key=lambda x: x['created_time'])
            
            if google_gmail_messages:
                google_gmail_messages = sorted(google_gmail_messages, key=lambda x: x['created_time'])
            
            if google_todos_messages:
                google_todos_messages = sorted(google_todos_messages, key=lambda x: x['created_time'])
            
            if google_youtube_messages:
                google_youtube_messages = sorted(google_youtube_messages, key=lambda x: x['created_time'])
            
            return JsonResponse({
                'status':'success',
                'included_apps': included_apps,
                'all_messages': data[::-1],
                'services': {
                    'Google_Event': google_calendar_messages,
                    'Gmail':  google_gmail_messages,
                    'Google_Todo': google_todos_messages,
                    'YouTube': google_youtube_messages,
                },
            }, safe=False)
            
        return JsonResponse({
            'status': 'error',
            'message': 'token not valid, sign out and sign in again',
        }, safe=False)
        
    else:
        return JsonResponse({
            'status': 'error',
            'message': 'token not valid, sign out and sign in again'
        }, safe=False)
            
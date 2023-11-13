from django.http import JsonResponse
from allauth.socialaccount.models import SocialToken, SocialApp

from ...utils import  get_email_text, get_header_value
from ...services.google import google_calendar, google_todos , google_gmail, google_youtube
from ...services.github import github_notifications
from ...services.facebook import notifications as facebook_notifications

from ...services.microsoft import (microsoft_events, 
                                                        microsoft_mails, 
                                                        microsoft_onenotes, 
                                                        microsoft_todos)


"""
   TODO: Gmail Messages
"""
def gmail_messages_list(request): 
    socialGoogleTokens = SocialToken.objects.filter(account__user=request.user, account__provider='google')
    data = []
        
    if socialGoogleTokens:
        for socialGoogleToken in socialGoogleTokens:
            access_token = socialGoogleToken.token
            access_email = socialGoogleToken.account.extra_data.get('email', None)
            
            response = google_gmail.GoogleGmailService(access_token,  socialGoogleToken.id, get_email_text, get_header_value, access_email)
            
            if response[0] == 'success':
                data.extend(response[1])
                
        if data != []:
            sorted_events = sorted(data, key=lambda event: event['created_time'])
            
            return JsonResponse({
                    'status':'success',
                    'type': 'Gmail',
                    'data': sorted_events[::-1],
                },  status=200)
        else:
            return JsonResponse({
                    'status':'error',
                    'message': response[1]
                })

"""
   TODO: Google Todo
"""
def google_todo_messages_list(request): 
    socialGoogleTokens = SocialToken.objects.filter(account__user=request.user, account__provider='google')
    data = []
    
    if socialGoogleTokens:
        for socialGoogleToken in socialGoogleTokens:
            access_token = socialGoogleToken.token
            access_email = socialGoogleToken.account.extra_data.get('email', None)
            
            response = google_todos.GoogleTodoService(access_token, socialGoogleToken.id, access_email)
            
            if response[0] == 'success':
                data.extend(response[1])
            
        if data != []:
            sorted_events = sorted(data, key=lambda event: event['created_time'])
            
            return JsonResponse({
                    'status':'success',
                    'type': 'Google_Todo',
                    'data': sorted_events[::-1],
                },  status=200)
        else:
            return JsonResponse({
                    'status':'error',
                    'message': response[1]
                })
                    
"""
   TODO: Google Event
"""
def google_calendar_messages_list(request): 
    socialGoogleTokens = SocialToken.objects.filter(account__user=request.user, account__provider='google')
    data = []
    
    if socialGoogleTokens:
        for socialGoogleToken in socialGoogleTokens:
            access_token = socialGoogleToken.token
            access_email = socialGoogleToken.account.extra_data.get('email', None)
            
            response = google_calendar.CallendarService(access_token, socialGoogleToken.id, access_email)
            
            if response[0] == 'success':
                data.extend(response[1])
                
        if data != []:
            sorted_events = sorted(data, key=lambda event: event['created_time'])
            
            return JsonResponse({
                    'status':'success',
                    'type': 'Google_Event',
                    'data': sorted_events[::-1],
                },  status=200)
        else:
            return JsonResponse({
                    'status':'error',
                    'message': response[1]
                })

"""
   TODO: YouTube Notifications
"""
def google_youtube_messages_list(request): 
    socialGoogleTokens = SocialToken.objects.filter(account__user=request.user, account__provider='google')
    data = []
    
    if socialGoogleTokens:
        for socialGoogleToken in socialGoogleTokens:
            access_token = socialGoogleToken.token
            access_email = socialGoogleToken.account.extra_data.get('email', None)
            
            response = google_youtube.GoogleYoutubeService(access_token, socialGoogleToken.id, access_email)
        
            if response[0] == 'success':
                data.extend(response[1])
                
        if data != []:
            sorted_events = sorted(data, key=lambda event: event['created_time'])
            
            return JsonResponse({
                    'status':'success',
                    'type': 'YouTube',
                    'data': sorted_events[::-1],
                },  status=200)
        else:
            return JsonResponse({
                    'status':'error',
                    'message': response[1]
                })
            
"""
   TODO: GitHub Notifications
"""
def github_messages_list(request): 
    socialGitHubTokens = SocialToken.objects.filter(account__user=request.user, account__provider='github')
    data = []
    
    if socialGitHubTokens:
        for socialGoogleToken in socialGitHubTokens:
            access_token = socialGoogleToken.token
            
            response = github_notifications.GitHubService(access_token, socialGoogleToken.id)
        
            if response[0] == 'success':
                data.extend(response[1])
                
        if data != []:
            sorted_events = sorted(data, key=lambda event: event['created_time'])
            
            return JsonResponse({
                    'status':'success',
                    'type': 'GitHub',
                    'data': sorted_events[::-1],
                },  status=200)
        else:
            return JsonResponse({
                    'status':'error',
                    'message': response[1]
                })
    return JsonResponse({
        'status':'error',
        'message': 'Tokens not found'
    })
    
"""
   TODO: Facebook Notifications
"""
def facebook_messages_list(request): 
    socialFacebookTokens = SocialToken.objects.filter(account__user=request.user, account__provider='facebook')
    data = []
    
    print(socialFacebookTokens)
    if socialFacebookTokens:
        for socialFacebookToken in socialFacebookTokens:
            access_token = socialFacebookToken.token
            
            response = facebook_notifications.FacebookService(access_token, socialFacebookToken.id)
        
            if response[0] == 'success':
                data.extend(response[1])
                
        if data != []:
            sorted_events = sorted(data, key=lambda event: event['created_time'])
            
            return JsonResponse({
                    'status':'success',
                    'type': 'Facebook',
                    'data': sorted_events[::-1],
                },  status=200)
        else:
            return JsonResponse({
                    'status':'error',
                    'message': response[1]
                })
            
    return JsonResponse({
        'status':'error',
        'message': 'Tokens not found'
    })
    
"""
   TODO: Microsoft TODO
"""
def microsoft_todos_list(request): 
    socialMicrosoftTokens = SocialToken.objects.filter(account__user=request.user, account__provider='microsoft')
    data = []
    
    if socialMicrosoftTokens:
        for socialMicrosoftToken in socialMicrosoftTokens:
            access_token = socialMicrosoftToken.token
            
            response = microsoft_todos.MicrosoftTodoService(access_token, socialMicrosoftToken.id)
        
            if response[0] == 'success':
                data.extend(response[1])
                
        if data != []:
            sorted_events = sorted(data, key=lambda event: event['created_time'])
            
            return JsonResponse({
                    'status':'success',
                    'type': 'Microsoft_Todo',
                    'data': sorted_events[::-1],
                },  status=200)
        else:
            return JsonResponse({
                    'status':'error',
                    'message': response[1]
                })
            
    return JsonResponse({
        'status':'error',
        'message': 'Tokens not found'
    })
    
"""
   TODO: Microsoft Mails
"""
def microsoft_mails_list(request): 
    socialMicrosoftTokens = SocialToken.objects.filter(account__user=request.user, account__provider='microsoft')
    data = []
    
    if socialMicrosoftTokens:
        for socialMicrosoftToken in socialMicrosoftTokens:
            access_token = socialMicrosoftToken.token
            
            response = microsoft_mails.MicrosoftMailsService(access_token, socialMicrosoftToken.id)
        
            if response[0] == 'success':
                data.extend(response[1])
                
        if data != []:
            sorted_events = sorted(data, key=lambda event: event['created_time'])
            
            return JsonResponse({
                    'status':'success',
                    'type': 'Microsoft_Mails',
                    'data': sorted_events[::-1],
                },  status=200)
        else:
            return JsonResponse({
                    'status':'error',
                    'message': response[1]
                })
            
    return JsonResponse({
        'status':'error',
        'message': 'Tokens not found'
    })


"""
   TODO: Microsoft Events
"""
def microsoft_events_list(request): 
    socialMicrosoftTokens = SocialToken.objects.filter(account__user=request.user, account__provider='microsoft')
    data = []
    
    if socialMicrosoftTokens:
        for socialMicrosoftToken in socialMicrosoftTokens:
            access_token = socialMicrosoftToken.token
            
            response = microsoft_events.MicrosoftCalendarService(access_token, socialMicrosoftToken.id)
        
            if response[0] == 'success':
                data.extend(response[1])
                
        if data != []:
            sorted_events = sorted(data, key=lambda event: event['created_time'])
            
            return JsonResponse({
                    'status':'success',
                    'type': 'Microsoft_Calendar',
                    'data': sorted_events[::-1],
                },  status=200)
        else:
            return JsonResponse({
                    'status':'error',
                    'message': response[1]
                })
            
    return JsonResponse({
        'status':'error',
        'message': 'Tokens not found'
    })

"""
   TODO: Microsoft OneNote
"""
def microsoft_onenotes_list(request): 
    socialMicrosoftTokens = SocialToken.objects.filter(account__user=request.user, account__provider='microsoft')
    data = []
    
    if socialMicrosoftTokens:
        for socialMicrosoftToken in socialMicrosoftTokens:
            access_token = socialMicrosoftToken.token
            
            response = microsoft_onenotes.MicrosoftOneNotesService(access_token, socialMicrosoftToken.id)
        
            if response[0] == 'success':
                data.extend(response[1])
                
        if data != []:
            sorted_events = sorted(data, key=lambda event: event['created_time'])
            
            return JsonResponse({
                    'status':'success',
                    'type': 'Microsoft_OneNote',
                    'data': sorted_events[::-1],
                },  status=200)
        else:
            return JsonResponse({
                    'status':'error',
                    'message': response[1]
                })
            
    return JsonResponse({
        'status':'error',
        'message': 'Tokens not found'
    })

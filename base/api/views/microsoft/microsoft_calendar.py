from django.http import JsonResponse
from allauth.socialaccount.models import SocialToken, SocialApp
from django.views.decorators.csrf import csrf_exempt

import requests
import json

@csrf_exempt
def MicrosoftCalendar(request, socialMicrosoftTokenId, calendar_id, event_id):
    socialToken = SocialToken.objects.get(id=socialMicrosoftTokenId)
   
    if socialToken:
        access_token = socialToken.token

        if request.method == 'POST':
            title = request.POST.get('title')

            if len(title) > 2:

                payload = json.dumps({
                    "subject": title
                })
                print(calendar_id, event_id, payload)
                response = requests.patch(f'https://graph.microsoft.com/v1.0/me/calendars/{calendar_id}/events/{event_id}', headers = {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + access_token
                }, data= payload) 

                if response.status_code == 200:
                    return  JsonResponse({
                        'status': 'success',
                        'message': f'Microsoft event with ID {event_id} updated successfully'
                    }, safe=False)
                print(f'Failed to update Microsoft event with ID {event_id}, status code: {response.status_code}, response: {response.content}')
                return JsonResponse({
                    'status': 'error',
                    'message': f'Failed to update Microsoft event with ID {event_id}, status code: {response.status_code}'
                }, status=400)
            
            return JsonResponse({
                'status': 'error',
                'message': 'Todo is too short',
            }, status=400)
                
        elif request.method == 'DELETE':
            response = requests.delete(f'https://graph.microsoft.com/v1.0/me/calendars/{calendar_id}/events/{event_id}', headers = {
                'Authorization': 'Bearer ' + access_token
            }) 
            
            if response.status_code == 204:
                return  JsonResponse({
                    'status': 'success',
                    'message': f'Microsoft event with ID {event_id} deleted successfully'
                }, safe=False)
            else:
                return JsonResponse({
                    'status': 'error',
                    'message': f'Failed to delete Microsoft event with ID {event_id}, status code: {response.status_code}'
                }, status=400)
            
        return JsonResponse({
            'status': 'error',
            'message': 'Method not allowed'
        }, status=402) 
      
    return JsonResponse({
        'status': 'error',
        'message': 'Token not found'
    }, status=401)    
        
        
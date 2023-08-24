import requests

from django.http import JsonResponse
from allauth.socialaccount.models import SocialToken, SocialApp
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
def GoogleCalendarPatchTitle(request, calendarId, eventId):
    socialGoogleToken = SocialToken.objects.filter(account__user=request.user, account__provider='google').last()
   
    if socialGoogleToken:
        access_token = socialGoogleToken.token
        
        # TODO: UPDATE Calendar Event
        if request.method == 'POST':
            summary = request.POST.get('title')
         
            response = requests.patch(f'https://www.googleapis.com/calendar/v3/calendars/{calendarId}/events/{eventId}', params={
                'access_token': access_token,
            }, json =  {
                "summary": summary
            })
            
            if response.status_code == 200:
                return  JsonResponse({
                    'status': 'success',
                    'message': f'Event with ID {eventId} updated successfully'
                }, safe=False)
            else: 
                return JsonResponse({
                    'status': 'error',
                    'message': f'Failed to patch event with ID {eventId}, status code: {response.status_code}'
                }, safe=False)
            
        # TODO: DELETE Calendar Event
        if request.method == 'DELETE':
            response = requests.delete(f'https://www.googleapis.com/calendar/v3/calendars/{calendarId}/events/{eventId}', params={
                'access_token': access_token,
            })
            
            if response.status_code == 204:
                return  JsonResponse({
                    'status': 'success',
                    'message': f'Event with ID {eventId} deleted successfully'
                }, safe=False)
            else:
                return JsonResponse({
                    'status': 'error',
                    'message': f'Failed to delete event with ID {eventId}, status code: {response.status_code}'
                }, safe=False)
            
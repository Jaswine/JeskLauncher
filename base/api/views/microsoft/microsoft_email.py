from django.http import JsonResponse
from allauth.socialaccount.models import SocialToken, SocialApp
from django.views.decorators.csrf import csrf_exempt
import requests

@csrf_exempt
def MicrosoftEmail(request, socialMicrosoftTokenId, email_id):
    socialToken = SocialToken.objects.get(id=socialMicrosoftTokenId)
   
    if socialToken:
        access_token = socialToken.token
        
        if request.method == 'DELETE':

            response = requests.delete(f'https://graph.microsoft.com/v1.0/me/messages/{email_id}', headers = {
                'Authorization': 'Bearer ' + access_token
            }) 
            
            if response.status_code == 204:
                return  JsonResponse({
                    'status': 'success',
                    'message': f'Microsoft email with ID {email_id} deleted successfully'
                }, safe=False)
            else:
                return JsonResponse({
                    'status': 'error',
                    'message': f'Failed to email Microsoft todo with ID {email_id}, status code: {response.status_code}'
                }, status=400)
        else:
            return JsonResponse({
            'status': 'error',
            'message': 'Method not allowed'
            }, status=402)
        
    return JsonResponse({
        'status': 'error',
        'message': 'Token not found'
    }, status=401)
         
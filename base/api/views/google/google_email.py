import requests

from django.http import JsonResponse
from allauth.socialaccount.models import SocialToken, SocialApp
from django.views.decorators.csrf import csrf_exempt


@csrf_exempt
def GoogleGmailDelete(request, email_id):
   if request.method == 'DELETE':
      socialGoogleToken = SocialToken.objects.filter(account__user=request.user, account__provider='google').last()
      
      if socialGoogleToken:
         access_token = socialGoogleToken.token
         
         response = requests.delete(f'https://www.googleapis.com/gmail/v1/users/me/messages/{email_id}', params={
            'access_token': access_token,
         })
         
         print('______________response_______________', response)
         
         if response.status_code == 204:
            return  JsonResponse({
               'status': 'success',
               'message': f'Email with ID {email_id} deleted successfully'
            }, safe=False)
         else:
            return JsonResponse({
              'status': 'error',
              'message': f'Failed to delete email with ID {email_id}, status code: {response.status_code}'
            }, safe=False)
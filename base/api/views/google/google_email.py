import requests
import base64

from django.http import JsonResponse
from allauth.socialaccount.models import SocialToken, SocialApp
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
def GoogleGmail(request, email_id):
   socialGoogleToken = SocialToken.objects.filter(account__user=request.user, account__provider='google').last()
   
   if socialGoogleToken:
      access_token = socialGoogleToken.token
   
      if request.method == 'POST':
         message = request.POST.get('message')
         
         response_message = f"From: adfegecy@gmail.com\n" \
                   f"To: vaselesstolarov813@gmail.com\n" \
                   f"Subject: Re: {message}\n" \
                   f"\n" \
                   f"{message}"

         raw_message = base64.urlsafe_b64encode(response_message.encode("utf-8")).decode("utf-8")
      
         response = requests.post(
            f'https://www.googleapis.com/gmail/v1/users/me/messages/{email_id}/send',
            params={'access_token': access_token},
            json={
               "raw": raw_message
            }
         )

         print('Response:', response)

         if response.status_code == 200:
            return JsonResponse({
               'status': 'success',
               'message': 'Reply sent successfully'
            }, safe=False)
         else:
            print  ('reply_response:', response)
            return JsonResponse({
               'status': 'error',
               'message': f'Failed to send reply, status code: {response.status_code}'
            }, safe=False)
                  
      if request.method == 'DELETE':               
         response = requests.delete(f'https://www.googleapis.com/gmail/v1/users/me/messages/{email_id}', params={
            'access_token': access_token,
         })
         
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
            
@csrf_exempt
def GoogleGmailAddToTrash(request, email_id):
   socialGoogleToken = SocialToken.objects.filter(account__user=request.user, account__provider='google').last()
   
   if socialGoogleToken:
      access_token = socialGoogleToken.token
   
      if request.method == 'POST':  
         reply_response = requests.post(
               f'https://www.googleapis.com/gmail/v1/users/me/messages/{email_id}/trash',
               params={'access_token': access_token},
            )
               
         if reply_response.status_code == 200:
            return JsonResponse({
               'status': 'success',
               'message': f'Email with ID {email_id} moved successfully'
            }, safe=False)
         else:
            return JsonResponse({
               'status': 'error',
               'message': f'Failed to delete email with ID {email_id}, status code: {response.status_code}'
            }, safe=False)
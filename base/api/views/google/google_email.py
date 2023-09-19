import requests
import base64

from django.http import JsonResponse
from allauth.socialaccount.models import SocialToken, SocialApp
from django.views.decorators.csrf import csrf_exempt

# TODO: Функция для ответа на письмо
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
           
# TODO: Функция для добавления письма в корзину 
@csrf_exempt
def GoogleGmailAddToTrash(request, email_id):
   #  Взятие токена доступа апи
   socialGoogleToken = SocialToken.objects.filter(account__user=request.user, account__provider='google').last()
   
   if socialGoogleToken:
      access_token = socialGoogleToken.token
   
      if request.method == 'POST':  
         # Оправка запроса на добавление письма в корзину
         response = requests.post(
               f'https://www.googleapis.com/gmail/v1/users/me/messages/{email_id}/trash',
               params={'access_token': access_token},
            )
               
         # Проверка статуса пришедшего ответа
         if response.status_code == 200:
            return JsonResponse({
               'status': 'success',
               'message': f'Email with ID {email_id} deleted successfully'
            }, safe=False)
         else:
            return JsonResponse({
               'status': 'error',
               'message': f'Failed to delete email with ID {email_id}, status code: {response.status_code}'
            }, safe=False)
  
# TODO: Функция для архивирования письма            
@csrf_exempt
def GoogleGmailAddToArchive(request, email_id):
   #  Взятие токена доступа апи
   socialGoogleToken = SocialToken.objects.filter(account__user=request.user, account__provider='google').last()
   
   if socialGoogleToken:
      access_token = socialGoogleToken.token
   
      if request.method == 'POST':  
         labels_to_add = ["INBOX"]
         
         # Создания тела запроса
         modify_request_body = {
               "addLabelIds": labels_to_add
         }
          
         # Оправка запроса на архивирование письма   
         response = requests.post(
               f'https://www.googleapis.com/gmail/v1/users/me/messages/{email_id}/modify',
               params={'access_token': access_token},
               json=modify_request_body
            )
         
         # Проверка статуса пришедшего ответа
         if response.status_code == 200:
            return JsonResponse({
               'status': 'success',
               'message': f'Email with ID {email_id} archived successfully'
            }, safe=False)
         else:
            return JsonResponse({
               'status': 'error',
               'message': f'Failed to delete email with ID {email_id}, status code: {response.status_code}'
            }, safe=False)

# TODO: Функция для добавления письма в СПАМ           
@csrf_exempt
def GoogleGmailAddToSpam(request, email_id):
   #  Взятие токена доступа апи
   socialGoogleToken = SocialToken.objects.filter(account__user=request.user, account__provider='google').last()
   
   if socialGoogleToken:
      access_token = socialGoogleToken.token
   
      if request.method == 'POST': 
         labels_to_add = ["SPAM"]
          
         # Создания тела запроса
         modify_request_body = {
               "addLabelIds": labels_to_add
         }
            
         # Оправка запроса для добавления письма в СПАМ   
         response = requests.post(
               f'https://www.googleapis.com/gmail/v1/users/me/messages/{email_id}/modify',
               params={'access_token': access_token},
               json=modify_request_body
            )
             
         # Проверка статуса пришедшего ответа
         if response.status_code == 200:
            return JsonResponse({
               'status': 'success',
               'message': f'Email with ID {email_id} moved to SPAM successfully'
            }, safe=False)
         else:
            return JsonResponse({
               'status': 'error',
               'message': f'Failed to delete email with ID {email_id}, status code: {response.status_code}'
            }, safe=False)
            
# TODO: Функция для помечения письма, что оно не прочитано        
@csrf_exempt
def GoogleGmailAddUnreadStatus(request, email_id):
   #  Взятие токена доступа апи
   socialGoogleToken = SocialToken.objects.filter(account__user=request.user, account__provider='google').last()
   
   if socialGoogleToken:
      access_token = socialGoogleToken.token
   
      if request.method == 'POST':  
         labels_to_add = ["INBOX"]
         
         # Создания тела запроса
         modify_request_body = {
               "addLabelIds": labels_to_add,
               "removeLabelIds": []
         }
          
         # Оправка запроса для помечения письма, что оно не прочитано   
         response = requests.post(
               f'https://www.googleapis.com/gmail/v1/users/me/messages/{email_id}/modify',
               params={'access_token': access_token},
               json=modify_request_body
            )
         
         # Проверка статуса пришедшего ответа
         if response.status_code == 200:
            return JsonResponse({
               'status': 'success',
               'message': f'Email with ID {email_id} moved to unread successfully'
            }, safe=False)
         else:
            return JsonResponse({
               'status': 'error',
               'message': f'Failed to delete email with ID {email_id}, status code: {response.status_code}'
            }, safe=False)
            
# TODO: Функция для помечения письма, проставка звездочки      
@csrf_exempt
def GoogleGmailAddStar(request, email_id, star):
   #  Взятие токена доступа апи
   socialGoogleToken = SocialToken.objects.filter(account__user=request.user, account__provider='google').last()
   
   if socialGoogleToken:
      access_token = socialGoogleToken.token

      if request.method == 'POST':  
         if star == 'true':
            modify_request_body = {
               "removeLabelIds": ["STARRED"]
            }
         else:
            modify_request_body = {
               "addLabelIds": ["STARRED"] 
            }
          
         # Оправка запроса для помечения письма, проставка звездочки 
         response = requests.post(
               f'https://www.googleapis.com/gmail/v1/users/me/messages/{email_id}/modify',
               params={'access_token': access_token},
               json=modify_request_body
            )
         
         # Проверка статуса пришедшего ответа
         if response.status_code == 200:
            return JsonResponse({
               'status': 'success',
               'message': f'Email with ID {email_id} moved successfully'
            }, safe=False)
         else:
            return JsonResponse({
               'status': 'error',
               'message': f'Failed to delete email with ID {email_id}, status code: {response.status_code}'
            }, safe=False)
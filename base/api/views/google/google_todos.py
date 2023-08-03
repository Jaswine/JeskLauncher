import requests
import json

from django.http import JsonResponse
from allauth.socialaccount.models import SocialToken, SocialApp
from django.views.decorators.csrf import csrf_exempt


@csrf_exempt
def GoogleTodoServiceDelete(request, todo_list, todo_id):
   if request.method == 'DELETE':
      socialGoogleToken = SocialToken.objects.filter(account__user=request.user, account__provider='google').last()
   
      if socialGoogleToken:
         access_token = socialGoogleToken.token
         
         response = requests.delete(f'https://tasks.googleapis.com/tasks/v1/lists/{todo_list}/tasks/{todo_id}', params={
            'access_token': access_token,
         })
         
         return  JsonResponse({
               'status': 'success',
            }, safe=False)
      
@csrf_exempt
def GoogleTodoServiceComplete(request, todo_list, todo_id):
   if request.method == 'POST':
      socialGoogleToken = SocialToken.objects.filter(account__user=request.user, account__provider='google').last()
   
      if socialGoogleToken:
         access_token = socialGoogleToken.token
         
         data = json.loads(request.body.decode('utf-8'))
         status = data.get('status')
        
         response = requests.patch(f'https://tasks.googleapis.com/tasks/v1/lists/{todo_list}/tasks/{todo_id}', params={
            'access_token': access_token,
         }, json =  {
            "status": status
         })
         
         return  JsonResponse({
               'status': 'success',
            }, safe=False)
   
@csrf_exempt   
def GoogleTodoServicePatchTitle(request, todo_list, todo_id):
   if request.method == 'POST':
      socialGoogleToken = SocialToken.objects.filter(account__user=request.user, account__provider='google').last()
      
      if socialGoogleToken:
         access_token = socialGoogleToken.token
         title = request.POST.get('title')
         
         response = requests.patch(f'https://tasks.googleapis.com/tasks/v1/lists/{todo_list}/tasks/{todo_id}', params={
            'access_token': access_token,
         }, json =  {
            "title": title
         })
         
         return  JsonResponse({
               'status': 'success',
            }, safe=False)
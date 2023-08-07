import requests
import json

from django.http import JsonResponse
from allauth.socialaccount.models import SocialToken, SocialApp
from django.views.decorators.csrf import csrf_exempt


@csrf_exempt
def GoogleTodoDelete(request, todo_list, todo_id):
   if request.method == 'DELETE':
      socialGoogleToken = SocialToken.objects.filter(account__user=request.user, account__provider='google').last()
   
      if socialGoogleToken:
         access_token = socialGoogleToken.token
         
         response = requests.delete(f'https://tasks.googleapis.com/tasks/v1/lists/{todo_list}/tasks/{todo_id}', params={
            'access_token': access_token,
         }) 
         
         if response.status_code == 204:
            return  JsonResponse({
               'status': 'success',
               'message': f'Todo with ID {todo_id} deleted successfully'
            }, safe=False)
         else:
            return JsonResponse({
              'status': 'error',
              'message': f'Failed to delete todo with ID {todo_id}, status code: {response.status_code}'
            }, safe=False)
      
@csrf_exempt
def GoogleTodoComplete(request, todo_list, todo_id):
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
def GoogleTodoPatchTitle(request, todo_list, todo_id):
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
         
@csrf_exempt   
def GoogleTodoCreate(request):
   if request.method == 'POST':
      socialGoogleToken = SocialToken.objects.filter(account__user=request.user, account__provider='google').last()
      
      if socialGoogleToken:
         access_token = socialGoogleToken.token
         
         response = requests.get('https://www.googleapis.com/tasks/v1/users/@me/lists', params={
            'access_token': access_token,
         })
         
         all_list_todo = response.json().get('items', [])
         print("list todo's", all_list_todo)
         
         # todo_list = ''
         title = request.POST.get('title')
         # response = requests.create(f'https://tasks.googleapis.com/tasks/v1/lists/{todo_list}/tasks', params={
         #    'access_token': access_token,
         # }, json =  {
         #    "title": title
         # })
         
         return  JsonResponse({
               'status': 'success',
            }, safe=False)
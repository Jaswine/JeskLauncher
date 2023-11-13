from django.http import JsonResponse
from allauth.socialaccount.models import SocialToken, SocialApp
from django.views.decorators.csrf import csrf_exempt
import requests

@csrf_exempt   
def MicrosoftTodoCreate(request):
   if request.method == 'POST':
      socialToken = SocialToken.objects.filter(account__user=request.user, account__provider='microsoft').last()
      
      if socialToken:
        access_token = socialToken.token
         
        response_lists = requests.get(f'https://graph.microsoft.com/v1.0/me/todo/lists', headers = {
          'Authorization': 'Bearer ' + access_token
        })
         
        if response_lists.status_code == 200: 
            list =  response_lists.json().get('value', [])

            title =  request.POST.get('title')

            if len(title) > 4: 
               response = requests.get(f"https://graph.microsoft.com/v1.0/me/todo/lists/{list[0].get('id', '')}/tasks", headers = {
                    'Authorization': 'Bearer ' + access_token
                }, data = {
                "title": title
                })
            else:
                return JsonResponse({
                    'status': 'error',
                    'message': 'Todo is too short',
                })

            if response.status_code == 201:
                return  JsonResponse({
                    'status': 'success',
                    'message': 'Todo created successfully!',
                    'id': response.get('id'),
                }, safe=False)
            
        return  JsonResponse({
            'status': 'error',
        }, safe=False)
      
@csrf_exempt
def MicrosoftTodoPatchTitle(request, socialMicrosoftTokenId, todo_list, todo_id):
   if request.method == 'PUT':
      socialToken = SocialToken.objects.get(id=socialMicrosoftTokenId)
   
      if socialToken:
        access_token = socialToken.token

        title = request.POST.get('title')

        if len(title) > 4:
            response = requests.put(f'https://graph.microsoft.com/v1.0/me/todo/lists/{todo_list}/tasks/{todo_id}', headers = {
                    'Authorization': 'Bearer ' + access_token
            }, data = {
                'title': title,
            }) 
        else:
           return JsonResponse({
              'status': 'error',
              'message': 'Todo is too short',
           })
         
        if response.status_code == 200:
            return  JsonResponse({
               'status': 'success',
               'message': f'Microsoft todo with ID {todo_id} updated successfully'
            }, safe=False)
        else:
            return JsonResponse({
              'status': 'error',
              'message': f'Failed to update Microsoft todo with ID {todo_id}, status code: {response.status_code}'
            }, safe=False)
        
@csrf_exempt
def MicrosoftTodoComplete(request, socialMicrosoftTokenId, todo_list, todo_id):
   if request.method == 'PUT':
      socialToken = SocialToken.objects.get(id=socialMicrosoftTokenId)
   
      if socialToken:
        access_token = socialToken.token

        response = request.get(f'https://graph.microsoft.com/v1.0/me/todo/lists/{todo_list}/tasks/{todo_id}', headers = {
                'Authorization': 'Bearer ' + access_token
        })
        
        if response.status_code == 200:
            if response.status == 'completed':
                response = requests.put(f'https://graph.microsoft.com/v1.0/me/todo/lists/{todo_list}/tasks/{todo_id}', headers = {
                        'Authorization': 'Bearer ' + access_token
                }, data = {
                    'status': 'notStarted',
                }) 
            else:
               response = requests.put(f'https://graph.microsoft.com/v1.0/me/todo/lists/{todo_list}/tasks/{todo_id}', headers = {
                        'Authorization': 'Bearer ' + access_token
                }, data = {
                    'status': 'completed',
                }) 
            
            if response.status_code == 200:
                return  JsonResponse({
                'status': 'success',
                'message': f'Microsoft todo with ID {todo_id} updated successfully'
                }, safe=False)
        
        return JsonResponse({
            'status': 'error',
            'message': f'Failed to update Microsoft todo with ID {todo_id}, status code: {response.status_code}'
        }, safe=False)
         
@csrf_exempt
def MicrosoftTodoDelete(request, socialMicrosoftTokenId, todo_list, todo_id):
   if request.method == 'DELETE':
      socialToken = SocialToken.objects.get(id=socialMicrosoftTokenId)
   
      if socialToken:
         access_token = socialToken.token
         
         response = requests.delete(f'https://graph.microsoft.com/v1.0/me/todo/lists/{todo_list}/tasks/{todo_id}', headers = {
                'Authorization': 'Bearer ' + access_token
        }) 
         
         if response.status_code == 204:
            return  JsonResponse({
               'status': 'success',
               'message': f'Microsoft todo with ID {todo_id} deleted successfully'
            }, safe=False)
         else:
            return JsonResponse({
              'status': 'error',
              'message': f'Failed to delete Microsoft todo with ID {todo_id}, status code: {response.status_code}'
            }, safe=False)
         
from django.http import JsonResponse
from allauth.socialaccount.models import SocialToken, SocialApp
from django.views.decorators.csrf import csrf_exempt
import requests
import json

@csrf_exempt   
def MicrosoftTodoCreate(request):
   if request.method == 'POST':
      socialToken = SocialToken.objects.filter(account__user=request.user, account__provider='microsoft').last()
      
      if socialToken:
        access_token = socialToken.token
         
        response_lists = requests.get(f'https://graph.microsoft.com/v1.0/me/todo/lists', headers = {
          'Authorization': 'Bearer ' + access_token
        })
        print('RESPONSE_LISTS', response_lists.status_code)
         
        if response_lists.status_code == 200: 
            list =  response_lists.json().get('value', [])

            title =  request.POST.get('message')

            if len(title) > 2: 
                payload = json.dumps({
                    "title": title
                })
                response = requests.post(f"https://graph.microsoft.com/v1.0/me/todo/lists/{list[0].get('id', '')}/tasks", 
                    headers = {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + access_token
                    }, data = payload)

                if response.status_code == 201:
                    return  JsonResponse({
                        'status': 'success',
                        'message': 'Todo created successfully!',
                    }, safe=False)
                else:
                        return JsonResponse({
                        'status': 'error',
                        'message': f'Todo creation failed, status code: {response.status_code}'
                    }, safe=False)
            else:
                return JsonResponse({
                    'status': 'error',
                    'message': 'Todo is too short',
                })
                
        return  JsonResponse({
            'status': 'error',
            'message': f'Failed to create Microsoft todo, status code: {response.status_code}'
        }, safe=False)
      
@csrf_exempt
def MicrosoftTodo(request, socialMicrosoftTokenId, todo_list, todo_id):
    socialToken = SocialToken.objects.filter(id=socialMicrosoftTokenId)[0]
   
    if socialToken:
        access_token = socialToken.token

        if request.method == 'POST':
            title = request.POST.get('title')

            payload = json.dumps({
                "title": title
            })

            if len(title) > 2:
                response = requests.put(f'https://graph.microsoft.com/v1.0/me/todo/lists/{todo_list}/tasks/{todo_id}', 
                headers = {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + access_token
                }, data = payload)

                if response.status_code == 200:
                    return  JsonResponse({
                        'status': 'success',
                        'message': f'Microsoft todo with ID {todo_id} updated successfully'
                    }, safe=False)
                                
                return JsonResponse({
                    'status': 'error',
                    'message': f'Failed to update Microsoft todo with ID {todo_id}, status code: {response.status_code}, message: {response.content}'
                }, status=400)
            
            return JsonResponse({
                    'status': 'error',
                    'message': 'Todo is too short',
                }, status=400)
            
        elif request.method == 'DELETE':
            print('TODO_LIST', todo_list, 'TODO_ID', todo_id)
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
                }, status=400)

        return JsonResponse({
            'status': 'error',
            'message': 'Method not allowed'
            }, status=402)
    
    return JsonResponse({
           'status': 'error',
            'message': 'Token not found'
        }, status=401)
            
        
@csrf_exempt
def MicrosoftTodoComplete(request, socialMicrosoftTokenId, todo_list, todo_id, completion_status, message):
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
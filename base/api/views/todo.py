from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from ...models import Todo

@csrf_exempt
def todo_list_create(request):
    if request.method == 'GET':
        todos = Todo.objects.filter(user=request.user).order_by('-created_at')
        data = [{
                'id': todo.id, 
                'message': todo.message, 
                'created_at': todo.created_at
                } for todo in todos]
        return JsonResponse({
            'size': todos.count(),
            'todos': data   
        }, safe=False)
        
    elif request.method == 'POST':
        user = request.user
        message = request.POST.get('message')
        todo = Todo.objects.create(
            user=user, 
            message=message)
        data = {
                'id': todo.id, 
                'message': todo.message, 
                'created_at': todo.created_at
                }
        return JsonResponse(data, status=201)
    else:
        return JsonResponse({'error': 'Method not allowed'}, status=405)

@csrf_exempt
def todo_delete(request, pk):
    try:
        todo = Todo.objects.get(pk=pk)
        
        if request.method == 'DELETE':
            todo.delete()
            return JsonResponse({
                'message': 'Todo deleted successfully'
            }, status=204)
        
    except Todo.DoesNotExist:
        return JsonResponse({'error': 'Todo not found'}, status=404)
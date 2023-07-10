from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from ...models import TodaysNotes

@csrf_exempt
def today_notes_list_create(request):
    if request.method == 'GET':
        todays_notes = TodaysNotes.objects.filter(user=request.user).order_by('-created_at')
        data = [{
                'id': todo.id, 
                'message': todo.message, 
                'created_at': todo.created_at
                } for todo in todays_notes]
        return JsonResponse({
            'size': len(data),
            'notes' : data    
        }, safe=False)
    elif request.method == 'POST':
        user = request.user
        message = request.POST.get('message')
        todo = TodaysNotes.objects.create(
            user=user, 
            message=message)
        print(todo)
        data = {
                'id': todo.id, 
                'message': todo.message, 
                'created_at': todo.created_at
                }
        return JsonResponse(data, status=201)
    else:
        return JsonResponse({'error': 'Method not allowed'}, status=405)

@csrf_exempt
def today_notes_delete(request, pk):
    try:
        todo = TodaysNotes.objects.get(pk=pk)
        
        if request.method == 'DELETE':
            todo.delete()
            return JsonResponse({
                'message': 'Today note deleted'}, status=204)
        
    except TodaysNotes.DoesNotExist:
        return JsonResponse({'error': 'Today note not found'}, status=404)
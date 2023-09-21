from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from ..models import Todo, TodaysNotes, TestUser


def index_view(request):  
   if request.user.is_authenticated: 
      return render(request, 'base/index.html')
   else: 
      return render(request, 'base/lending.html')
   
@login_required(login_url='base:sign-in')
def delete_comment_view(request, task_id):
   task = Todo.objects.get(id=task_id)
   task.delete()
   return redirect('/')

@login_required(login_url='base:sign-in')
def delete_today_note_view(request, task_id):
   task = TodaysNotes.objects.get(id=task_id)
   task.delete()
   return redirect('/')


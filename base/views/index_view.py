from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from ..models import Todo, TodaysNotes


@login_required(login_url='base:sign-in')
def index_view(request):
   # bot_token = '6263736045:AAHXJM8S4NLQKEiH7O1f88pKOa6x9Y0pqLc'
   # bot = Bot(token=bot_token)
   # print('___________bot_______________', bot)
      
   context = {
      #  'emails': email_list,
   }
   return render(request, 'base/index.html', context)
   
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


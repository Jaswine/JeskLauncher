from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from ..models import Profile, Todo, TodaysNotes
import google.auth
import requests
from ..services.google import google_calendar, google_todos , google_gmail


from allauth.socialaccount.models import SocialToken, SocialApp
from allauth.account.models import EmailAddress
from allauth.socialaccount.models import SocialAccount
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build

from rest_framework.authtoken.models import Token
from ..utils import  get_email_text, get_header_value
from telegram import Bot

import base64


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


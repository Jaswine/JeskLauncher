from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required

from django.contrib.auth import login, logout, authenticate
from django.contrib import messages
from rest_framework_simplejwt.tokens import RefreshToken

from django.http import HttpResponse, HttpResponseRedirect

from ..forms import CreateUserForm
from ..models import Profile


def sign_in_view(request):
   if request.user.username:
      return redirect('base:index')
   
   page_type = 'sign-in'
   
   if request.method == 'POST':
      email = request.POST.get('email')
      password = request.POST.get('password')
      
      try: 
         user = User.objects.get(username=email)
      except:
         messages.error(request, '')
         
      user = authenticate(username=email, password=password)
      
      
      if user is not None:
         login(request, user)
         
         refresh  = RefreshToken.for_user(user)
         token = str(refresh.access_token)
         
         response = HttpResponseRedirect('/')
         
         response.set_cookie('access_token', token)
      
         #  redirect('base:index')
         return response
      else:
         messages.error(request, 'Invalid password or username')
      
   context = {
      'page_type': page_type
   }
   return render(request, 'base/auth.html', context)

def sign_up_view(request):
   page_type = 'sign-up'
   form = CreateUserForm()
   
   if request.method == 'POST':
      form = CreateUserForm(request.POST)
      
      if form.is_valid():
         new_user = form.save(commit=False)
         new_user.save()
         login(request, new_user,  backend='django.contrib.auth.backends.ModelBackend' )
         
         profile = Profile(user = request.user)
         
         refresh  = RefreshToken.for_user(user)
         token = str(refresh.access_token)
         
         response = HttpResponseRedirect('/')
         
         response.set_cookie('access_token', token)
         
         return response
      
   context = {
      'page_type': page_type,
      'form': form
   }
   return render(request, 'base/auth.html', context)

#apple id
@login_required(login_url='base:sign-in')
def sign_out_view(request):
   response = HttpResponseRedirect('/')
   response.delete_cookie('access_token')
   
   logout(request)
   return response


@login_required(login_url='base:sign-in')
def sign_in_social_media_view(request):
   user = request.user
   proifle = Profile.objects.get(user=user)
      
   context = {
      'profile': profile
   }
   return render(request, 'base/authIncludeAccounts.html', context)

def google_login_done(request):
    if request.user.is_authenticated:
        user = request.user
        refresh_token = user.socialaccount_set.filter(provider='google')[0].extra_data['refresh_token']
        # Здесь мы получаем refresh token, связанный с учетной записью Google пользователя

        # Генерация аксесс токена
        access_token_response = requests.post(
            'https://accounts.google.com/o/oauth2/token',
            data={
                'grant_type': 'refresh_token',
                'refresh_token': refresh_token,
                'client_id': '402939344578-5b58lkdodgtrfvshgprcekrh2ca6v4u8.apps.googleusercontent.com',
                'client_secret': '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'
            }
        )
        access_token = access_token_response.json().get('access_token')

        # Сохранение аксесс токена в куки
        response = HttpResponseRedirect('/')
        response.set_cookie('access_token', access_token)

        return response  # Перенаправляем пользователя на целевую страницу

    return HttpResponse('Authentication failed')
from django.http import JsonResponse
from allauth.socialaccount.models import SocialToken, SocialAccount
from django.views.decorators.csrf import csrf_exempt

from django.contrib.auth.hashers import make_password
from django.contrib.auth import update_session_auth_hash

from django.contrib.auth.models import User
from ...models import Profile, TestUser

import requests


@csrf_exempt
def update_settings(request):
    if request.method == 'GET':
        user =  User.objects.get(username=request.user.username)
        profile = Profile.objects.get(user=user)
        
        return JsonResponse({
                'status': 'success',
                'data': {
                    'username': user.username,
                    'email': user.email,
                    'avatar': profile.avatar.url
                }
            }, status=200)
        
    if request.method == 'POST':
        user =  User.objects.get(username=request.user.username)
        profile = Profile.objects.get(user=user)
        
        email = request.POST.get('email')
        password = request.POST.get('password', None)
        avatar = request.FILES.get('avatar', None)
        
        status = False
        
        if email != '' and email != request.user.email: 
            try:
                isHaveUser = User.objects.get(email=email)
                
                return JsonResponse({
                    'status': 'error', 
                    'message': 'Email address has been taken'
                }, status=400)
            except:
                user.email = email
                status = True
                    
        if password != '':
            user.password = make_password(password)   
            update_session_auth_hash(request, user)    
            status = True
            
        if avatar:
            profile.avatar = avatar
            status = True
                 
        if status:
            user.save()
            profile.save()
            
            return JsonResponse({
                'status': 'success',
                'message': 'Settings updated successfully'
            }, status=200)
            
        return JsonResponse({
            'status': 'success',
        }, status=200)
        
@csrf_exempt
def rewrite_tokens(request):
    social_token = SocialToken.objects.get(account__user=request.user, account__provider='google')  
    
    if social_token.token_secret:
        
        return JsonResponse({
            'status': 'success',
            'message': 'Tokens rewritten successfully'
        }, status=200)
        
    return JsonResponse({
        'status': 'error',
        'message': 'Tokens could not be rewritten because you don\'t have a valid refresh token'
    }, status=200)
    
    
def create_new_user(request):
    if request.method == 'POST':
        name = request.POST.get('name', '')
        email = request.POST.get('email')
        
        if len(email) > 5:
            user = TestUser.objects.create(
                name = name, 
                email = email
            )
            
            user.save()
            
            return JsonResponse({
                'status': 'success',
                'message': 'User has been created successfully'
            })
            
        return JsonResponse({
            'status': 'error',
            'message': 'Email length is so small'
        })

@csrf_exempt
def deleteAccount(request, id):
    if request.user.is_authenticated:
        if request.method == 'POST':
            try:
                account = SocialAccount.objects.get(id=id)
                account.delete()
                
                return JsonResponse({
                    'status': 'success',
                    'message': 'User deleted successfully'
                }, status=200)
            except:
                return JsonResponse({
                    'status': 'error',
                    'message': 'User not found'
                }, status=404)
                
        return JsonResponse({
            'status': 'error',
            'message': 'Method not allowed'
        }, status=405)
        
    return JsonResponse({
            'status': 'error',
            'message': 'You do not have any permissions'
        }, status=401)        
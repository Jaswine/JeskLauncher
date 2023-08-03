from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from django.contrib.auth.hashers import make_password
from django.contrib.auth import login
from django.contrib.auth import update_session_auth_hash

from django.contrib.auth.models import User

from allauth.socialaccount.models import SocialToken, SocialAccount
from google.oauth2.credentials import Credentials
from oauthlib.oauth2 import WebApplicationClient
import requests


@csrf_exempt
def update_settings(request):
    if request.method == 'POST':
        user =  User.objects.get(username=request.user.username)
        
        email = request.POST.get('email')
        password = request.POST.get('password')
        
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
                 
        if status:
            user.save()
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
        client_id = SocialAccount.objects.get(user=request.user, provider='google').uid
        client_secret = social_token.token,
        token_endpoint = 'https://accounts.google.com/o/oauth2/token'
            
        # response = requests.get('https://accounts.google.com/o/oauth2/token', params={
        #     'access_token': social_token.token,
        # }) 
        
        client = WebApplicationClient(client_id)

        token_url, headers, body = client.prepare_refresh_token_request(
            token_endpoint,
            refresh_token=social_token.token_secret,
        )
        

        token_response = requests.post(token_url, headers=headers, data=body, auth=(client_id, client_secret))

        if token_response.status_code == 200:
            new_token = token_response.json()
            social_token.token = new_token['access_token']
            social_token.save()
        else:
            print("Error refreshing token:", token_response.text)
    
        # social_token.token = refreshed_token
        # social_token.save()
        
        return JsonResponse({
            'status': 'success',
            'message': 'Tokens rewritten successfully'
        }, status=200)
        
    return JsonResponse({
        'status': 'error',
        'message': 'Tokens could not be rewritten because you don\'t have a valid refresh token'
    }, status=200)
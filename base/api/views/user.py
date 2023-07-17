from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from django.contrib.auth.hashers import make_password
from django.contrib.auth import login
from django.contrib.auth import update_session_auth_hash

from django.contrib.auth.models import User


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
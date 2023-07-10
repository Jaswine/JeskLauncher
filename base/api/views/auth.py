from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.status import (HTTP_200_OK, 
                                   HTTP_401_UNAUTHORIZED,
                                   HTTP_403_FORBIDDEN,
                                   HTTP_400_BAD_REQUEST,
                                   HTTP_201_CREATED
                                   )
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from rest_framework_simplejwt.tokens import RefreshToken

from ..validators import validate_email, validate_username

@api_view(['POST'])
def sign_up_view(request):
   username = validate_username(request.data['username'])
   email = validate_email(request.data['email'])
   password = request.data['password']
   password_confirmation = request.data['password_confirmation']
      
   if password_confirmation != password:
      return Response({'message': 'Password1 does not match password'},
                       status=HTTP_400_BAD_REQUEST)
      
   user = User.objects.create(username=username, email=email, password=password)
   
   refresh  = RefreshToken.for_user(user)
   
   refresh_token = str(refresh)
   token = str(refresh.access_token)
   
   return Response({
      'refresh_token': refresh_token,
      'token': token,
      }, status=HTTP_201_CREATED)
   
@api_view(['POST'])
def sign_in_view(request):
   username = request.data.get('username')
   password = request.data.get('password')
   user  = authenticate(request, username=username, password=password)
   
   if user is not None:
      login(request, user)
      
      refresh = RefreshToken.for_user(user)
      
      refresh_token = str(refresh)
      token = str(refresh.access_token)
   
      return Response({
         'refresh_token': refresh_token,
         'token': token
         }, status=HTTP_200_OK)
   else:
      return Response({'message': 'user not found'}, 
         status=HTTP_401_UNAUTHORIZED)
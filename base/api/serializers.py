from rest_framework.serializers import ModelSerializer
from ..models import Profile, Todo
from django.contrib.auth.models import User


class ProfileSerializer(ModelSerializer):
   class Meta:
      model = Profile
      fields = '__all__'
      
class UserSerializer(ModelSerializer):
   class Meta:
      model = User
      fields = ['username', ]
      
class TodoSerializer(ModelSerializer):
   user = UserSerializer()
   
   class Meta:
      model  = Todo
      fields = ['id', 'user', 'message', 'created_at']
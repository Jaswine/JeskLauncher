from django.forms import ModelForm, forms, CharField, TextInput, PasswordInput
from django.contrib.auth.models import User
from django.contrib.auth.forms import UserCreationForm

from allauth.account.forms import SignupForm



# create user
class CreateUserForm(UserCreationForm):
   username = CharField(widget=TextInput(attrs={'placeholder': 'Username'}))
   email = CharField(widget=TextInput(attrs={'placeholder': 'Email'}))
   password1 = CharField(widget=TextInput(attrs={'type': 'password', 'placeholder': ' Password'}))
   password2 = CharField(widget=TextInput(attrs={'type': 'password', 'placeholder': 'Repeat your password'}))
      
   class Meta:
      model = User
      fields = ['username', 'email', 'password1','password2']
      

class CustomSignupForm(SignupForm):
    first_name = CharField(max_length=30, label='First Name')
    last_name = CharField(max_length=30, label='Last Name')
    
    def signup(self, request, user):
        user.first_name = self.cleaned_data['first_name']
        user.last_name = self.cleaned_data['last_name']
        user.save()
        return user
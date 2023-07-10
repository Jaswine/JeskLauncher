from django.apps import AppConfig

# import allauth.socialaccount.models
from allauth.socialaccount.signals import (pre_social_login, 
                                           social_account_updated, 
                                           social_account_added)
import allauth.socialaccount
from django.dispatch import receiver
import django.contrib.auth


@receiver(pre_social_login)
def pre_social_login_callback(sender, request, sociallogin, **kwargs):
    socialtoken = sociallogin.token
    socialaccount = sociallogin.account
    
    user = socialaccount.user if hasattr(socialaccount, "user") else None

    if not user:
        email = socialaccount.extra_data["email"]
        
        if email:
            user = django.contrib.auth.models.User.objects.create_user(
                username=socialaccount.uid, email=email
            )
            sociallogin.connect(request, user)
        else:
            user = django.contrib.auth.models.User.objects.create_user(
                username=socialaccount.uid, email=''
            )
            sociallogin.connect(request, user)
            
    
    # Delete existing social tokens
    allauth.socialaccount.models.SocialToken.objects.filter(account__user=socialaccount.user, account__provider=socialaccount.provider).delete()

    # get social app
    socialApp = allauth.socialaccount.models.SocialApp.objects.get(provider=socialaccount.provider)
    # print('_______social_account_provider________', socialaccount.provider)
        
    token_secret = socialaccount.extra_data.get("refresh_token")
    if token_secret:
        socialtoken.token_secret = token_secret
        
    socialtoken.app_id = socialApp.id
    socialtoken.account_id = socialaccount.id
    socialtoken.save()
    

class BaseConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'base'

    def ready(self):        
        import base.signals    
        
        pre_social_login.connect(pre_social_login_callback)
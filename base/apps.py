from django.apps import AppConfig

# import allauth.socialaccount.models
from allauth.socialaccount.signals import (pre_social_login, 
                                           social_account_updated, 
                                           social_account_added)
import allauth.socialaccount
from django.dispatch import receiver
import django.contrib.auth
import base


@receiver(pre_social_login)
def pre_social_login_callback(sender, request, sociallogin, **kwargs):
    socialtoken = sociallogin.token
    socialaccount = sociallogin.account
    
    user = socialaccount.user if hasattr(socialaccount, "user") else None
    
    # Первый вход пользователя через социальную сеть
    if request.user.is_authenticated:
        existing_social_account = allauth.socialaccount.models.SocialAccount.objects.filter(provider=socialaccount.provider, uid=socialaccount.uid).first()
        
        if existing_social_account:
            print('\n\n\n',existing_social_account, existing_social_account.user.username, '\n\n\n')
        else:
            socialaccount = allauth.socialaccount.models.SocialAccount.objects.create(
                user=request.user,
                provider=socialaccount.provider,
                uid=socialaccount.uid,
                extra_data=socialaccount.extra_data,
            )
            socialaccount.save()
        
            request.user.socialaccount_set.add(socialaccount)
    else:
        if not user:
            email = socialaccount.extra_data.get("email", "")
            
            user = django.contrib.auth.models.User.objects.create_user(
                username=socialaccount.uid, email=email
            )
            sociallogin.connect(request, user)
    
    # Delete existing social tokens
    try:
        tokens_to_delete = allauth.socialaccount.models.SocialToken.objects.filter(account__user=socialaccount.user, account__provider=socialaccount.provider)
        print('tokens_to_delete', tokens_to_delete)

        for token in tokens_to_delete:
            # Получаем extra_data из социального аккаунта связанного с этим токеном
            extra_data = token.account.extra_data
        
            # Сравниваем uid и email с желаемыми значениями
            if socialaccount.provider == 'google':
                if str(token.account.uid) == str(socialaccount.uid) and extra_data.get('email') == socialaccount.extra_data.get('email'):
                    # Удаляем токен, если uid и email соответствуют
                    token.delete()
    except:
        print('Tokens not found')

    # get social app
    socialApp = allauth.socialaccount.models.SocialApp.objects.get(provider=socialaccount.provider)
        
    refresh_token = socialaccount.extra_data.get("refresh_token", "")
    if refresh_token:
        socialtoken.token_secret = refresh_token
        
    socialtoken.app_id = socialApp.id
    socialtoken.account_id = socialaccount.id
    socialtoken.save()
    

class BaseConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'base'

    def ready(self):        
        import base.signals    
        
        pre_social_login.connect(pre_social_login_callback)
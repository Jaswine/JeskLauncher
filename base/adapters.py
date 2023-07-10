from allauth.socialaccount.adapter import DefaultSocialAccountAdapter
from allauth.socialaccount.models import SocialToken

class CustomSocialAccountAdapter(DefaultSocialAccountAdapter):
    def save_user(self, request, sociallogin, form=None):
        user = super().save_user(request, sociallogin, form=form)
        access_token = sociallogin.token.token
        refresh_token = sociallogin.token.token_secret
        token = SocialToken(account=sociallogin.account, token=access_token, token_secret=refresh_token)
        token.save()
        return user
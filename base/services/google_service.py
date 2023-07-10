from allauth.socialaccount.models import SocialToken
import google.auth
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build


def get_google_service(request, api_name, api_version, scopes):
    social_token = SocialToken.objects.get(account__user=request.user, account__provider='google')
    credentials = Credentials.from_authorized_user_info(
        social_token.token, scopes=scopes
    )
    if not credentials.valid:
        if credentials.expired and credentials.refresh_token:
            credentials.refresh(Request())
            social_token.token = credentials.to_json()
            social_token.save()

    service = build(api_name, api_version, credentials=credentials)
    return service

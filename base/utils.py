import base64

def get_header_value(headers, name):
    for header in headers:
        if header['name'] == name:
            return header['value']
    return None

def get_email_text(payload):
    if 'parts' in payload:
        for part in payload['parts']:
            if 'body' in part:
                data = part['body'].get('data')
                if data:
                    return base64.urlsafe_b64decode(data).decode('utf-8')
    return None

def refresh_token(token, refresh_token):
    provider = token.account.provider
    provider_instance = registry.by_id(provider)
    access_token = token.token

    # Call the refresh_token method provided by the authentication provider
    new_token = provider_instance.get_refreshed_token(access_token, refresh_token)

    # Update the token in your database or storage
    token.token = new_token
    token.save()

    return new_token

def format_time(seconds):
    m, s = divmod(seconds, 60)
    h, m = divmod(m, 60)
    return f"{int(h):02d}:{int(m):02d}:{int(s):02d}"
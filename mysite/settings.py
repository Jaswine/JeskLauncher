from pathlib import Path
import os

# import dotenv

# dotenv.load_dotenv()

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.1/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = '_6jbso1z+%9-qbavp0656*cxi@)#i$(%=(#2i)ly@osu@zh!w3'

# TODO: generate new secret key
# * python -c 'import secrets; print(secrets.token_hex(24))' 

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True
# DEVELOPMENT_MODE = os.environ.get("DEVELOPMENT_MODE", True)

# ALLOWED_HOSTS = os.environ.get("DJANGO_ALLOWED_HOSTS", "127.0.0.1,localhost").split(",")
ALLOWED_HOSTS = ['*']
# pip install django  django-allauth  
# dj_database_url google-auth google-api-python-client python-telegram-bot

# Application definition
INSTALLED_APPS = [    
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    
    'base',
    
    'django.contrib.sites',
     
    'allauth',
    'allauth.account',
    'allauth.socialaccount',
    
    'allauth.socialaccount.providers.google',
    'allauth.socialaccount.providers.github',
    
    'allauth.socialaccount.providers.facebook',
    'allauth.socialaccount.providers.instagram',
    
    'allauth.socialaccount.providers.trello',
    'allauth.socialaccount.providers.microsoft',
    
    # 'django_extensions',
]

#  python3 manage.py runserver_plus --cert-file /tmp/cert

SITE_ID = 2
SOCIALACCOUNT_LOGIN_ON_GET=True

LOGIN_REDIRECT_URL = '/'
LOGOUT_REDIRECT_URL = '/'


MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    # 'allauth.account.auth_backends.AuthenticationBackend',
]

ROOT_URLCONF = 'mysite.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [
            BASE_DIR / 'templates',
        ],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
                'django.template.context_processors.request',
            ],
        },
    },
]

WSGI_APPLICATION = 'mysite.wsgi.application'


# Database
# https://docs.djangoproject.com/en/4.1/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}
    

# Password validation
# https://docs.djangoproject.com/en/4.1/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/4.1/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.1/howto/static-files/

STATIC_URL = 'static/'
MEDIA_URL = 'media/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
MEDIA_ROOT =  BASE_DIR / 'static/media'

STATICFILES_DIRS = [
    BASE_DIR /'static'
]

# EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'

# Default primary key field type
# https://docs.djangoproject.com/en/4.1/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'


SOCIALACCOUNT_PROVIDERS = {
    'google': {
        'SCOPE': [
            'profile', 
            'email',
            'https://www.googleapis.com/auth/gmail.readonly',
            'https://www.googleapis.com/auth/gmail.modify',
            
            'https://mail.google.com/',
            
            'https://www.googleapis.com/auth/tasks.readonly',
            'https://www.googleapis.com/auth/tasks',
            
            'https://www.googleapis.com/auth/calendar.readonly',
            'https://www.googleapis.com/auth/calendar.events',
            'https://www.googleapis.com/auth/youtube.readonly',
            
        ],
        'AUTH_PARAMS': {
            'access_type': 'offline',
            'prompt': 'consent',
        },
        'APP': {
            'client_id': os.environ.get('GOOGLE_CLIENT_ID'),
            'secret': os.environ.get('GOOGLE_SECRET'),
            'key': os.environ.get('GOOGLE_API_KEY'),
        },
    },
    'github': {
        'SCOPE': [
            'user',
            'repo',
            'read:org',
            'notifications',
        ],
        'AUTH_PARAMS': {'access_type': 'online'},
        'APP': {
            'client_id': os.environ.get('GITHUB_CLIENT_ID'),
            'secret': os.environ.get('GITHUB_SECRET'), 
        },
    },
    # "microsoft": {
    #     'SCOPE': [
    #         'openid', 
    #         'User.ReadBasic.All', 
    #         'Mail.Read', 
    #         'Mail.ReadWrite', 
    #         # 'Mail.Send',
    #         'Tasks.Read',
    #         'Tasks.ReadWrite',
    #         'Calendars.Read',
    #         'Calendars.ReadWrite', 
    #         'User.Read',
    #     ],
    #     'METHOD': 'oauth2',
    #     'VERIFIED_EMAIL': False,  
    #     # 'VERSION': 'v2.0',  # Версия Microsoft Graph API
    #     'AUTH_PARAMS': {'access_type': 'online'},
    #     'APP': {
    #         'client_id': os.environ.get('MICROSOFT_CLIENT_ID'),
    #         'secret': os.environ.get('MICROSOFT_SECRET'),
    #         "settings": {
    #             "tenant": "organizations",
    #         } 
    #     },
    #     # https://127.0.0.1:8000/accounts/microsoft/login/callback
    # }
}

# TELEGRAM_BOT_TOKEN = os.environ.get('TELEGRAM_TOKEN')

ACCOUNT_EMAIL_REQUIRED = True
ACCOUNT_AUTHENTICATION_METHOD = 'email'


SOCIALACCOUNT_QUERY_EMAIL = True
SOCIALACCOUNT_EMAIL_REQUIRED = True

SOCIALACCOUNT_STORE_TOKENS = True

AUTHENTICATION_BACKENDS = [
    'django.contrib.auth.backends.ModelBackend',
    'allauth.account.auth_backends.AuthenticationBackend',
]

TEMPLATE_CONTEXT_PROCESSORS = (
    "django.core.context_processors.request",
    "allauth.account.context_processors.account",
    "allauth.socialaccount.context_processors.socialaccount",
)
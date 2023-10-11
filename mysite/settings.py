from pathlib import Path
import os

import dotenv

dotenv.load_dotenv()

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
        
        # 'ENGINE': 'django.db.backends.postgresql',
        # 'NAME': 'railway',
        # 'HOST': 'containers-us-west-11.railway.app',
        # 'PORT': '6121',
        # 'PASSWORD': 'Ob07Ocsi2UIgTnVaVIXd',
        # 'USER': 'postgres',
        
        # 'ENGINE': 'djongo',
        # # 'NAME': 'MongoDB',
        # 'CLIENT': {
        #     'host': f'mongodb://mongo:uBxAFQooIasyhEOFiChy@containers-us-west-115.railway.app:7916',
        # },
        # 'OPTIONS': {
        #     'connect': False,    
        # },
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
                # 'https://www.googleapis.com/auth/gmail.compose',
                # 'https://www.googleapis.com/auth/gmail.send',
                # 'https://www.googleapis.com/auth/gmail.insert',
                # 'https://www.googleapis.com/auth/gmail.metadata',
            'https://mail.google.com/',
            
            'https://www.googleapis.com/auth/tasks.readonly',
            'https://www.googleapis.com/auth/tasks',
            
            'https://www.googleapis.com/auth/calendar.readonly',
            # 'https://www.googleapis.com/auth/calendar',
            'https://www.googleapis.com/auth/calendar.events',
            
            # 'https://www.googleapis.com/auth/youtube',
            'https://www.googleapis.com/auth/youtube.readonly',
            # 'https://www.googleapis.com/auth/youtube.force-ssl',
            
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
            'client_id': '23fb9b076a04eb9cd6a5',
            'secret': '085dfa213bda5ef164a0ea24056bba6fe93f8441', 
        },
    },
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
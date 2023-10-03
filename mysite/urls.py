from django.contrib import admin
from django.urls import path, include

from . import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('base.urls')),
    path('api/', include('base.api.urls')),
        
    path('privacy-police', views.privacy_policy, name='privacy'),
    path('terms-of-use', views.terms_of_use, name='terms'),
    path('delete-instructions', views.delete_instructions, name='delete-instructions'),
    
    path('accounts/', include('allauth.urls')),
]

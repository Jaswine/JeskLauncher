from django.contrib import admin
from .models import Todo, Profile

class ProfileAdmin(admin.ModelAdmin):
   list_display = ('user', 'google_token')
   
class TodoAdmin(admin.ModelAdmin):
   list_display = ('user', 'message', 'created_at' )
   
admin.site.register(Profile)
admin.site.register(Todo)
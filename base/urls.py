from django.urls import path

from .views.base_auth_view import (sign_in_view, 
                                   sign_up_view, 
                                   sign_out_view, 
                                   sign_in_social_media_view,
                                   google_login_done)
from .views.index_view import (index_view, 
                               delete_comment_view, 
                               delete_today_note_view)
from .views.user import delete_account
from .views.admin import (admin, 
                          download_test_users_excel, 
                          download_test_users_text,
                          download_users_excel,
                          download_users_text)

app_name ='base'

urlpatterns = [
   path('',index_view, name='index'),
   path('tasks/<int:task_id>/delete', delete_comment_view, name='task_delete'),
   path('today_notes/<int:task_id>/delete', delete_today_note_view, name='delete_today_note'),
   
   path('sign-in', sign_in_view, name='sign-in'),
   path('sign-up', sign_up_view, name='sign-up'),
   path('sign-out', sign_out_view, name='sign-out'),
   
   path('google-login/done/', google_login_done, name='google_login_done'),
   path('sign-in-social-media-view', sign_in_social_media_view, name='sign-in-social-media'),
   
   path('delete-account/', delete_account, name='delete_account'),
   
   path('admin-panel', admin, name='admin-panel'),
   path('admin-panel-download-test-users-excel', download_test_users_excel, name='download_test_users_excel'),
   path('admin-panel-download-test-users-text', download_test_users_text, name='download_test_users_text'),
   path('admin-panel-download-users-excel', download_users_excel, name='download_users_excel'),
   path('admin-panel-download-users-text', download_users_text, name='download_users_text'),
   
]

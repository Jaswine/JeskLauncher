from django.urls import path
from .views import todo, today_tasks, messages, user
from .views.google import google_calendar, google_todos, google_email

urlpatterns = [
    # TODO: ____ todos _____
    path('todos', todo.todo_list_create, name='todo_list_create'),
    path('todos/<str:pk>', todo.todo_delete, name='todo_delete'),
    
    # TODO: ____ today notes _____
    path('today-notes', today_tasks.today_notes_list_create, name='today_notes_list_create'),
    path('today-notes/<str:pk>', today_tasks.today_notes_delete, name='today_notes_delete'),

    # TODO: ____ messages _____
    path('messages/gmail', messages.gmail_messages_list, name='gmail_messages_list'),
    path('messages/google-todo', messages.google_todo_messages_list, name='google_todo_messages_list'),
    path('messages/google-calendar', messages.google_calendar_messages_list, name='google_calendar_messages_list'),
    path('messages/youtube', messages.google_youtube_messages_list, name='google_youtube_messages_list'),

    path('messages/github', messages.github_messages_list, name='github_messages_list'),

    path('messages/facebook', messages.facebook_messages_list, name='facebook_messages_list'),

    path('messages/microsoft-todo', messages.microsoft_todos_list, name='microsoft_todos_list'),
    path('messages/microsoft-mails', messages.microsoft_mails_list, name='microsoft_mails_list'),
    path('messages/microsoft-events', messages.microsoft_events_list, name='microsoft_events_list'),
    path('messages/microsoft-onenotes', messages.microsoft_onenotes_list, name='microsoft_onenotes_list'),
    
    # TODO: ____ settings ____
    path('settings', user.update_settings, name='update_settings'),
    
    # TODO: ____ google todo _____
    path('create-todo', google_todos.GoogleTodoCreate, name='create_google_todo'),
    
    path('delete-todo/<int:socialGoogleTokenId>/<str:todo_list>/<str:todo_id>', google_todos.GoogleTodoDelete, name='delete_google_todo'),
    path('сomplete-todo/<int:socialGoogleTokenId>/<str:todo_list>/<str:todo_id>', google_todos.GoogleTodoComplete, name='complete_google_todo'),
    path('patch-title-todo/<int:socialGoogleTokenId>/<str:todo_list>/<str:todo_id>', google_todos.GoogleTodoPatchTitle, name='patch_title_google_todo'),
    
    # TODO: ____ google email _____
    path('google-gmail/<int:socialGoogleTokenId>/<str:email_id>', google_email.GoogleGmail, name='google_gmail'),
    path('google-gmail/<int:socialGoogleTokenId>/<str:email_id>/trash', google_email.GoogleGmailAddToTrash, name='google_gmail_trash'),
    path('google-gmail/<int:socialGoogleTokenId>/<str:email_id>/archive', google_email.GoogleGmailAddToArchive, name='google_gmail_archive'),
    path('google-gmail/<int:socialGoogleTokenId>/<str:email_id>/spam', google_email.GoogleGmailAddToSpam, name='google_gmail_spam'),
    path('google-gmail/<int:socialGoogleTokenId>/<str:email_id>/unread', google_email.GoogleGmailAddUnreadStatus, name='google_gmail_unread_status'),
    path('google-gmail/<int:socialGoogleTokenId>/<str:email_id>/star/<str:star>', google_email.GoogleGmailAddStar, name='google_gmail_star'),
    
    
    # TODO: ____ google event _____
    path('google-event/<int:socialGoogleTokenId>/<str:calendarId>/<str:eventId>', google_calendar.GoogleCalendarPatchTitle, name='google_event'),
    
    # TODO: ____ account ____
    path('rewrite-tokens', user.rewrite_tokens, name='rewrite_tokens'), 
    path('create-new-user', user.create_new_user, name='create_new_new'),
    path('delete-account/<int:id>', user.deleteAccount, name='delete_account'),
]
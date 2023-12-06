from django.urls import path
from .views import (todo, 
                                today_tasks, 
                                messages, 
                                user, 
                                social_messages,
                                social_messages2)

from .views.google import google_calendar, google_todos, google_email
from .views.microsoft import microsoft_calendar, microsoft_email, microsoft_onenote, microsoft_todos


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

    # TODO: ____ messages ____
    path('messages2/', social_messages.messages_list, name='social_messages2'),
    path('messages/', social_messages2.MessagesListView.as_view(), name='social_messages'),
    
    # TODO: ____ settings ____
    path('settings', user.update_settings, name='update_settings'),
    
    # TODO: ____ google todo _____
    path('google-todo/', google_todos.GoogleTodoCreate, name='google_todo_create'),
    path('google-todo/<int:socialGoogleTokenId>/lists/<str:todo_list>/tasks/<str:todo_id>/complete', google_todos.GoogleTodoComplete, name='google_todo_complete'),
    path('google-todo/<int:socialGoogleTokenId>/lists/<str:todo_list>/tasks/<str:todo_id>', google_todos.GoogleTodoUpdateDelete, name='google_todo_update_delete'),
    
    # TODO: ____ google email _____
    path('google-gmail/<int:socialGoogleTokenId>/<str:email_id>', google_email.GoogleGmail, name='google_gmail'),
    path('google-gmail/<int:socialGoogleTokenId>/<str:email_id>/trash', google_email.GoogleGmailAddToTrash, name='google_gmail_trash'),
    path('google-gmail/<int:socialGoogleTokenId>/<str:email_id>/archive', google_email.GoogleGmailAddToArchive, name='google_gmail_archive'),
    path('google-gmail/<int:socialGoogleTokenId>/<str:email_id>/spam', google_email.GoogleGmailAddToSpam, name='google_gmail_spam'),
    path('google-gmail/<int:socialGoogleTokenId>/<str:email_id>/unread', google_email.GoogleGmailAddUnreadStatus, name='google_gmail_unread_status'),
    path('google-gmail/<int:socialGoogleTokenId>/<str:email_id>/star/<str:star>', google_email.GoogleGmailAddStar, name='google_gmail_star'),
    
    # TODO: ____ google event _____
    path('google-event/<int:socialGoogleTokenId>/<str:calendarId>/<str:eventId>', google_calendar.GoogleCalendarPatchTitle, name='google_event'),
    
    # TODO: ____ microsoft todo _____
    path('microsoft-todo/', microsoft_todos.MicrosoftTodoCreate, name='microsoft_todo_create'),
    path('microsoft-todo/<int:socialMicrosoftTokenId>/lists/<str:todo_list>/tasks/<str:todo_id>/', microsoft_todos.MicrosoftTodo, name='microsoft_todo'),
    path('microsoft-todo/<int:socialMicrosoftTokenId>/lists/<str:todo_list>/tasks/<str:todo_id>/change-place', microsoft_todos.MicrosoftTodoComplete, name='microsoft_todo_change_place'),

    # TODO: ____ microsoft email _____
    path('microsoft-email/<int:socialMicrosoftTokenId>/<str:email_id>/', microsoft_email.MicrosoftEmail, name='microsoft_email'),

    # TODO: ____ microsoft calendar _____
    path('microsoft-event/<int:socialMicrosoftTokenId>/list/<str:calendar_id>/tasks/<str:event_id>', microsoft_calendar.MicrosoftCalendar, name='microsoft_calendar'),
    
    # TODO: ____ account ____
    path('rewrite-tokens', user.rewrite_tokens, name='rewrite_tokens'), 
    path('create-new-user', user.create_new_user, name='create_new_new'),
    path('delete-account/<int:id>', user.deleteAccount, name='delete_account'),

]
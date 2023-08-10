import requests
import asyncio

from datetime import datetime
from dateutil import parser


def GoogleGmailService(email_list, access_token, get_email_text, get_header_value, included_apps):
   async def fetch_emails():
      responseEmail = requests.get('https://www.googleapis.com/gmail/v1/users/me/messages', params={
         'access_token': access_token,
         'maxResults': 20
      })
      
      # print('______________response______________', response)
      if responseEmail.status_code == 200:
         included_apps.append('Gmail')
         
         emails = responseEmail.json().get('messages', [])
         # print('____________emails______________', emails)

         for email in emails:
               email_id = email['id']
               email_response = requests.get(f'https://www.googleapis.com/gmail/v1/users/me/messages/{email_id}', params={
                  'access_token': access_token
               })
               if email_response.status_code == 200:                  
                  email_data = email_response.json()
                  created_time = get_header_value(email_data['payload']['headers'], 'Date')
                  # TODO: Sat, 15 Jul 2023 08:26:59 +0000  =>  2023-06-05 16:45:12
                  
                  dt = parser.parse(created_time)
                  created_time = dt.strftime("%Y-%m-%d %H:%M:%S")
                  
                  email_list.append({
                     'id': email_data['id'],
                     'type': 'Gmail',
                     'title': get_header_value(email_data['payload']['headers'], 'Subject'), 
                     'sender': get_header_value(email_data['payload']['headers'], 'From'), 
                     'link': 'https://mail.google.com/mail/u/0/#inbox/{}'.format(email_data['id']),
                     'text': get_email_text(email_data['payload']),
                     'created_time': created_time,
                  })
                  
         print('Google Email loaded successfully ✅')
         
         return email_list
                  
                  
   asyncio.run(fetch_emails())

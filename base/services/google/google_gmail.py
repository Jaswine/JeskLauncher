import requests
import asyncio
import time

from dateutil import parser
from ...utils import format_time


def GoogleGmailService(
      email_list, 
      access_token, 
      get_email_text, 
      get_header_value, 
      included_apps
   ):
   
   messages = []
   
   async def fetch_emails():
      start_time = time.time()
      
      response = requests.get('https://www.googleapis.com/gmail/v1/users/me/messages', params={
         'access_token': access_token,
         'maxResults': 20
      })
      
      if response.status_code == 200:
         included_apps.append('Gmail')
         
         emails = response.json().get('messages', [])

         for email in emails:
               email_id = email['id']
               email_response = requests.get(f'https://www.googleapis.com/gmail/v1/users/me/messages/{email_id}', params={
                  'access_token': access_token
               })
               if email_response.status_code == 200:                  
                  email_data = email_response.json()
                  created_time = get_header_value(email_data.get('payload', '').get('headers', ''), 'Date')
                  # TODO: Sat, 15 Jul 2023 08:26:59 +0000  =>  2023-06-05 16:45:12
                  
                  dt = parser.parse(created_time)
                  created_time = dt.strftime("%Y-%m-%d %H:%M:%S")
                  
                  messages.append({
                     'id': email_data.get('id'),
                     'type': 'Gmail',
                     'title': get_header_value(email_data['payload']['headers'], 'Subject'), 
                     'sender': get_header_value(email_data['payload']['headers'], 'From'), 
                     'link': 'https://mail.google.com/mail/u/0/#inbox/{}'.format(email_data['id']),
                     'text': get_email_text(email_data['payload']),
                     'created_time': created_time,
                  })
                  
               elif email_response.status_code == 401 or email_response.status_code == 403:
                  print(f"Error: {email_response.status_code}")
                  raise Exception(f"Error {email_response.status_code}: Unauthorized or Forbidden")
           
         email_list.extend(messages)
                
         elapsed_time = time.time() - start_time                  
         print(f'Google Email loaded successfully ✅ - {format_time(elapsed_time)}')
         time.sleep(1)
         
      elif response.status_code == 401 or response.status_code == 403:
         print(f"Error: {response.status_code}")
         raise Exception(f"Error {response.status_code}: Unauthorized or Forbidden")
         
   try:
      asyncio.run(fetch_emails())
   except Exception as e:
      print(f"An error occurred: {str(e)}")
      return messages
   
   return messages         
   

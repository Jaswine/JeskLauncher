import requests
import asyncio
import time

from dateutil import parser
from ...utils import format_time


def MicrosoftMailsService(access_token, social_google_token):
   messages = []
   
   async def fetch_microsoft_mails():
      start_time = time.time()
      
      response = requests.get('https://graph.microsoft.com/v1.0/me/messages', headers = {
          'Authorization': 'Bearer ' + access_token
        }, 
        params = {
            '$top': 20,
            '$orderby': 'receivedDateTime desc'
        })
            
      if response.status_code == 200:  
        mails  =  response.json().get('value', [])    

        for mail in mails:
            messages.append({
               'id':  mail.get('id', ''),
               'type': 'Microsoft_Mails',
               'title':  mail.get('subject', ''),
               'sender': mail.get('toRecipients', [{}])[0].get('emailAddress', {}).get('address', '') if mail.get('toRecipients','') else '',
               'link': f"https://outlook.live.com/mail/0/sentitems/id/{''.join('%2B' if n == '_' else n for n in mail.get('conversationId', '') )}%3D",   
               'text': mail.get('body', '').get('content', ''),
               'created_time': str(mail.get('sentDateTime', '')),
               
               'social_google_token_id': social_google_token,
            })            
                        
        elapsed_time = time.time() - start_time                  
        print(f'Google Email loaded successfully ✅ - {format_time(elapsed_time)}')
        time.sleep(1)
         
      elif response.status_code == 401 or response.status_code == 403:
         raise Exception(f"Error {response.status_code}: Unauthorized or Forbidden")
         
   try:
      asyncio.run(fetch_microsoft_mails())
   except Exception as e:
      print(f"An error occurred: {str(e)}")
      return ['error', str(e)]
   
   return ['success', messages]       
   

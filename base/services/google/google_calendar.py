import requests
import asyncio
import time

from ...utils import format_time
from datetime import datetime


def CallendarService(email_list, access_token, included_apps):
   messages = []
   
   async def fetch_callendar():
      start_time = time.time()
      
      response = requests.get('https://www.googleapis.com/calendar/v3/calendars/primary/events', params={
         'access_token': access_token,
         'maxResults': 10
      })
      
      if response.status_code == 200:
         included_apps.append('Google_Event')
         
         events = response.json().get('items', [])
         
         for event in events:
            created_time = event['created']
            
            created_time = datetime.strptime(created_time, "%Y-%m-%dT%H:%M:%S.%fZ")
            description = event.get('description', '')
            
            messages.append({
               'id': event['id'],
               'type': 'Google_Event',
               'title':  event['summary'], 
               'sender' : '',
               'link': f"https://calendar.google.com",
               'text': description,
               'created_time': created_time
            })
            
         email_list.extend(messages)
         
         elapsed_time = time.time() - start_time                  
         print(f'Google Callendar Events loaded successfully ✅ - {format_time(elapsed_time)}')
         time.sleep(1)
                        
   asyncio.run(fetch_callendar())
   return messages
   
import requests
import asyncio

from datetime import datetime


def CallendarService(email_list, access_token, included_apps):
   async def fetch_callendar():
      response = requests.get('https://www.googleapis.com/calendar/v3/calendars/primary/events', params={
         'access_token': access_token,
         'maxResults': 10
      })
      
      if response.status_code == 200:
         included_apps.append('Google Event')
         
         events = response.json().get('items', [])
         
         for event in events:
            created_time = event['created']
            
            created_time = datetime.strptime(created_time, "%Y-%m-%dT%H:%M:%S.%fZ")
            description = event.get('description', '')
            
            email_list.append({
               'id': event['id'],
               'type': 'Google Event',
               'title':  event['summary'], 
               'sender' : '',
               'link': f"https://calendar.google.com",
               'text': description,
               'created_time': created_time
            })
            
         print('Google Callendar Events loaded successfully ✅')
            
         return email_list, included_apps
   
   asyncio.run(fetch_callendar())
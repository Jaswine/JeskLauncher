import requests
import asyncio
import time

from ...utils import format_time
from datetime import datetime

def CallendarService(email_list, access_token, included_apps):
   messages = []

   async def fetch_last_event(calendar_id):
      response = requests.get(f'https://www.googleapis.com/calendar/v3/calendars/{calendar_id}/events', params={
         'access_token': access_token,
         'maxResults': 10,
         'orderBy': 'startTime',
         'singleEvents': True,
      })
      if response.status_code == 200:
         events = response.json().get('items', [])

         for event in events:
            created = event.get('created', '')
            created_time = datetime.strptime(created, "%Y-%m-%dT%H:%M:%S.%fZ")
            description = event.get('description', '')
            
            messages.append({
               'id': event.get('id'),
               'type': 'Google_Event',
               'title': event.get('summary', ''),
               'sender': '',
               'link': event.get('htmlLink', ''),
               'text': description,
               'calendar_id': calendar_id,
               'created_time': created_time
            })
            
      elif response.status_code == 401 or response.status_code == 403:
         print(f"Error: {response.status_code}")
         raise Exception(f"Error {response.status_code}: Unauthorized or Forbidden")
      
   async def fetch_all_calendars():
      start_time = time.time()

      response = requests.get('https://www.googleapis.com/calendar/v3/users/me/calendarList', params={
         'access_token': access_token,
      })
      
      if response.status_code == 200:
         included_apps.append('Google_Event')

         calendar_list = response.json().get('items', [])

         tasks = [fetch_last_event(calendar.get('id')) for calendar in calendar_list]
         await asyncio.gather(*tasks)

         elapsed_time = time.time() - start_time
         print(f'Google Calendar Last Events loaded successfully ✅ - {format_time(elapsed_time)}')
         
      elif response.status_code == 401 or response.status_code == 403:
         print(f"Error: {response.status_code}")
         raise Exception(f"Error {response.status_code}: Unauthorized or Forbidden")

   try:
      asyncio.run(fetch_all_calendars())
   except Exception as e:
      print(f"An error occurred: {str(e)}")
      return messages

   email_list.extend(messages)
   return messages

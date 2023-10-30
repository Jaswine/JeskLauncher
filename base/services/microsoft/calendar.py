import requests
import asyncio
import time

from dateutil import parser
from ...utils import format_time


def MicrosoftCalendarService(access_token, social_google_token):
   messages = []
   
   async def fetch_microsoft_calendar():
      start_time = time.time()
      
      response_lists = requests.get(f'https://graph.microsoft.com/v1.0/me/calendars', headers = {
          'Authorization': 'Bearer ' + access_token
        })
            
      if response_lists.status_code == 200: 
         list =  response_lists.json().get('value', [])
         
         for calendar in list:
            response = requests.get(f"https://graph.microsoft.com/v1.0/me/calendars/{calendar.get('id', '')}/events", headers = {
               'Authorization': 'Bearer ' + access_token
            }, params = {
               '$top': 20,
            })

            if response.status_code == 200: 
               events =  response.json().get('value', [])

               for event in events:
                  messages.append({
                        'id':  event.get('id', ''),
                        'type': 'Microsoft_Calendar',
                        'title':  event.get('subject', ''),
                        'sender' : event.get('organizer', '').get('emailAddress', '').get('name', ''),
                        'link': event.get('webLink', ''),   
                        'text': event.get('bodyPreview', ''),
                        'created_time': str(event.get('createdDateTime', '')),
                        
                        'social_google_token_id': social_google_token,
                        'status': event.get('status', ''),
                     })
         
         elapsed_time = time.time() - start_time                  
         print(f'Microsoft Todos loaded successfully ✅ - {format_time(elapsed_time)}')
         time.sleep(1)
         
      elif response_lists.status_code == 401 or response_lists.status_code == 403:
         raise Exception(f"Error {response_lists.status_code}: Unauthorized or Forbidden")
         
   try:
      asyncio.run(fetch_microsoft_calendar())
   except Exception as e:
      print(f"An error occurred: {str(e)}")
      return ['error', str(e)]
   
   return ['success', messages]       
   

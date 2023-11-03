import requests
import asyncio
import time

from dateutil import parser
from ...utils import format_time


def MicrosoftOneNotesService(access_token, social_google_token):
   messages = []
   
   async def fetch_microsoft_one_notes():
      start_time = time.time()
      
      response = requests.get('https://graph.microsoft.com/v1.0/me/onenote/notebooks/', headers = {
          'Authorization': 'Bearer ' + access_token
        }, 
        params = {
            '$top': 20,
        })
            
      if response.status_code == 200:  
        onenotes  =  response.json().get('value', [])    

        for note in onenotes:
            messages.append({
               'id':  note.get('id', ''),
               'type': 'Microsoft_OneNote',
               'title':  note.get('displayName', ''),
               'sender': note.get('createdBy', '').get('user', '').get('displayName', ''),
               'link': note.get('links', '').get('oneNoteWebUrl', '').get('href', ''),   
               'text': '',
               'created_time': str(note.get('createdDateTime', '')),
               
               'social_google_token_id': social_google_token,
            })      
                        
        elapsed_time = time.time() - start_time                  
        print(f'Microsoft OneNote loaded successfully ✅ - {format_time(elapsed_time)}')
        time.sleep(1)
         
      elif response.status_code == 401 or response.status_code == 403:
         raise Exception(f"Error {response.status_code}: Unauthorized or Forbidden")
         
   try:
      asyncio.run(fetch_microsoft_one_notes())
   except Exception as e:
      print(f"An error occurred: {str(e)}")
      return ['error', str(e)]
   
   return ['success', messages]       
   

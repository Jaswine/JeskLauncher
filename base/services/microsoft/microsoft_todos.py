import requests
import asyncio
import time

from dateutil import parser
from ...utils import format_time


def MicrosoftTodoService(access_token, social_google_token):
   messages = []
   
   async def fetch_microsoft_todos():
      start_time = time.time()
      
      response_lists = requests.get(f'https://graph.microsoft.com/v1.0/me/todo/lists', headers = {
          'Authorization': 'Bearer ' + access_token
        })
            
      if response_lists.status_code == 200: 
         list =  response_lists.json().get('value', [])
         response = requests.get(f"https://graph.microsoft.com/v1.0/me/todo/lists/{list[0].get('id', '')}/tasks", headers = {
            'Authorization': 'Bearer ' + access_token
         }, params = {
            '$filter': "status ne 'completed'"
         })

         if response.status_code == 200: 
            tasks =  response.json().get('value', [])

            for task in tasks:
                messages.append({
                     'id':  task.get('id', ''),
                     'type': 'Microsoft_Todo',
                     'title':  task.get('title', ''),
                     'sender' : '',
                     'link': f"https://to-do.live.com/tasks/id/{task.get('id', '')}/details",   
                     'text': task.get('notes', ''),
                     'created_time': str(task.get('createdDateTime', '')),
                     
                     'social_google_token_id': social_google_token,
                     'status': task.get('status', ''),
                  })
         
         elapsed_time = time.time() - start_time                  
         print(f'Microsoft Todos loaded successfully ✅ - {format_time(elapsed_time)}')
         time.sleep(1)
         
      elif response_lists.status_code == 401 or response_lists.status_code == 403:
         raise Exception(f"Error {response_lists.status_code}: Unauthorized or Forbidden")
         
   try:
      asyncio.run(fetch_microsoft_todos())
   except Exception as e:
      print(f"An error occurred: {str(e)}")
      return ['error', str(e)]
   
   return ['success', messages]       
   

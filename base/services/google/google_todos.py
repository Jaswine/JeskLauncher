import requests
import asyncio
import time

from ...utils import format_time
from datetime import datetime


def GoogleTodoService(email_list, access_token, included_apps):
   messages = []
   
   async def fetch_todos():
      start_time = time.time()
      response_tasks = requests.get('https://www.googleapis.com/tasks/v1/users/@me/lists', params={
            'access_token': access_token,
      })     
      
      if response_tasks.status_code == 200:
         included_apps.append('Google_Todo')
         
         for task_list in response_tasks.json().get('items', []):
            list_id = task_list['id']
            
            # Request tasks for the current list
            response_tasks = requests.get(f'https://www.googleapis.com/tasks/v1/lists/{list_id}/tasks', params={
               'access_token': access_token,
               "showCompleted": True,
               "showHidden": True,
            })
            
            if response_tasks.status_code == 200:
               # Process the tasks for the current list
               for task in response_tasks.json().get('items', []):
                  created_time = task['updated']
                  
                  # TODO: 2023-06-05T16:45:03.000Z        =>         2023-06-05 16:45:12
                  created_time = datetime.strptime(created_time, "%Y-%m-%dT%H:%M:%S.%fZ")
                  
                  messages.append({
                     'id':  task['id'],
                     'type': 'Google_Todo',
                     'title':  task['title'],
                     'sender' : '',
                     'link': f"https://mail.google.com/tasks/canvas?pli=1&vid=default&task={task['id']}",   
                     'text': task.get('notes', ''),
                     'created_time': created_time,
                     
                     'list_id': list_id,
                     'status': task['status'],
                  })
               
         email_list.extend(messages)
         
         elapsed_time = time.time() - start_time                  
         print(f'Google Todos loaded successfully ✅ - {format_time(elapsed_time)}')
         time.sleep(1) 
                           
   asyncio.run(fetch_todos())
   return messages
   
import requests
import asyncio

from datetime import datetime


def GoogleTodoService(email_list, access_token):
   async def fetch_todos():
      response_tasks = requests.get('https://www.googleapis.com/tasks/v1/users/@me/lists', params={
            'access_token': access_token,
      })     
      
      for task_list in response_tasks.json().get('items', []):
         list_id = task_list['id']
         
         # Request tasks for the current list
         response_tasks = requests.get(f'https://www.googleapis.com/tasks/v1/lists/{list_id}/tasks', params={
            'access_token': access_token,
            # 'maxResults': 10,
            "showCompleted": True,
            "showHidden": True,
            # "showDeleted": True,
         })
         
         # Process the tasks for the current list
         for task in response_tasks.json().get('items', []):
            created_time = task['updated']
            
            # TODO: 2023-06-05T16:45:03.000Z        =>         2023-06-05 16:45:12
            created_time = datetime.strptime(created_time, "%Y-%m-%dT%H:%M:%S.%fZ")
            
            email_list.append({
               'id':  task['id'],
               'type': 'Google Todo',
               'title':  task['title'],
               'sender' : '',
               'link': f"https://mail.google.com/tasks/canvas?pli=1&vid=default&task={task['id']}",   
               'text': task.get('notes', ''),
               'created_time': created_time,
               
               'list_id': list_id,
               'status': task['status'],
            })
         
            
      print('Google Todos loaded successfully ✅')   
                     
      return email_list
   
   asyncio.run(fetch_todos())
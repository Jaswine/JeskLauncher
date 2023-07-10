import requests
import asyncio


def GoogleTodoService(email_list, access_token):
   async def fetch_todos():
      response_tasks = requests.get('https://www.googleapis.com/tasks/v1/users/@me/lists', params={
            'access_token': access_token,
            'maxResults': 10
      })     
      
      for task_list in response_tasks.json().get('items', []):
         list_id = task_list['id']
         
         # Request tasks for the current list
         response_tasks = requests.get(f'https://www.googleapis.com/tasks/v1/lists/{list_id}/tasks', params={
            'access_token': access_token,
            'maxResults': 10
         })
         
         # Process the tasks for the current list
         for task in response_tasks.json().get('items', []):
            email_list.append({
               'id':  task['id'],
               'type': 'google_todo',
               'title':  task['title'],
               'sender' : '',
               'link': f"https://mail.google.com/tasks/canvas?pli=1&vid=default&task={task['id']}",   
               'text': '',
               'created_time': task['updated'][:-5]
            })
                     
      return email_list
   
   asyncio.run(fetch_todos())
import requests
import asyncio


def GoogleYoutubeService(email_list, access_token):
   async def fetch_todos():
      response = requests.get('https://www.googleapis.com/youtube/v3/activities', params={
            'access_token': access_token,
            'maxResults': 10,
            'mine': True,
            'part': 'snippet',
      })     
      
      
      for task_list in response.json().get('items', []):         
         activity = task_list.get('snippet', {})
         video_id = task_list['id']
         created_time = activity['publishedAt']
         
         # # Process the tasks for the current list
         email_list.append({
            'id':  video_id,
            'type': 'YouTube',
            'title':  activity['title'],
            'sender' : '',
            'link': f"https://mail.google.com/tasks/canvas?pli=1&vid=default&task={video_id}",   
            'text': activity['description'],
            'created_time': created_time
         })
                     
      return email_list
   
   asyncio.run(fetch_todos())
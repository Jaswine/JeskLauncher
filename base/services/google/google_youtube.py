import requests
import asyncio
import time

from ...utils import format_time


def GoogleYoutubeService(access_token, social_google_token, access_email=''):
   messages = []
   
   async def fetch_todos():
      start_time = time.time()
      
      response = requests.get('https://www.googleapis.com/youtube/v3/activities', params={
            'access_token': access_token,
            'maxResults': 10,
            'mine': True,
            'part': 'snippet',
      })     
      
      
      if response.status_code == 200:
         for task_list in response.json().get('items', []):     
            # print(f'\n\n {task_list} \n\n')    
            activity = task_list.get('snippet', {})
            video_id = task_list.get('id', '')
            created_time = activity.get('publishedAt', '')
            
            # # Process the tasks for the current list
            messages.append({
               'id':  video_id,
               'type': 'YouTube',
               'title':  activity.get('title', ''),
               'sender' : activity.get('channelTitle', ''),
               'thumbnail': activity.get('thumbnails', '').get('default', '').get('url', ''),
               'link': "https://www.youtube.com/watch?v={}".format(video_id),   
               'text': activity.get('description', ''),
               'created_time': str(created_time),

               'account_email': access_email,
               'social_google_token_id': social_google_token,
            })
                     
         elapsed_time = time.time() - start_time                  
         print(f'Google YouTube loaded successfully ✅ - {format_time(elapsed_time)}')
         time.sleep(1)
         
      elif response.status_code == 401 or response.status_code == 403:
         print(f"Error: {response.status_code}")
         raise Exception(f"Error {response.status_code}: Unauthorized or Forbidden") 
   
   try:
      asyncio.run(fetch_todos())
   except Exception as e:
      print(f"An error occurred: {str(e)}")
      return ['error',  str(e)]
   
   return ['success', messages]
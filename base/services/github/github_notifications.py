import requests
import asyncio
import time

from ...utils import format_time


def GitHubService(access_token, social_google_token):
   messages = []
   
   async def fetch_github_notifications():
      start_time = time.time()
      
      response = requests.get('https://api.github.com/notifications', 
      headers = { 
         'Authorization': f'token {access_token}'
      }, params={
         'per_page': 20,
         'all': 'true'  
      })
      
      if response.status_code == 200:         
        notifications = response.json()

        for notification in notifications:                  
            messages.append({
               'id': notification.get('id'),
               'social_google_token_id': social_google_token,
               'type': 'GitHub',
               'title': notification.get('subject').get('title'), 
               'sender': notification.get('repository').get('owner').get('login'), 
               'link': f"https://github.com/{notification.get('subject').get('url')[28:]}",
               'text': notification.get('subject').get('description', ''),
               'created_time': str(notification.get('updated_at')),
            })
                  
                           
        elapsed_time = time.time() - start_time                  
        print(f'GitHub notifications loaded successfully ✅ - {format_time(elapsed_time)}')
        time.sleep(1)
         
      elif response.status_code == 401 or response.status_code == 403:
         raise Exception(f"Error {response.status_code}: Unauthorized or Forbidden")
         
   try:
      asyncio.run(fetch_github_notifications())
   except Exception as e:
      print(f"An error occurred: {str(e)}")
      return ['error', str(e)]
   
   return ['success', messages]       
   

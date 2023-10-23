import requests
import asyncio
import time

from ...utils import format_time


def FacebookService(access_token, social_google_token):
    messages = []
    print('____________________ FacebookService is running __________________')
   
    print('__________________hi______________')
    async def fetch_facebook_notifications():
      start_time = time.time()
      
      response = requests.get('https://graph.facebook.com/v10.0/me/notifications', 
        headers={'Authorization': f'Bearer {access_token}'}, 
        params={
            'limit': 20,
            'all': 'true'  
        })
      
      if response.status_code == 200: 
        print(response.content)        
        # notifications = response.json()

        # for notification in notifications:                  
        #     messages.append({
        #        'id': notification.get('id'),
        #        'social_google_token_id': social_google_token,
        #        'type': 'GitHub',
        #        'title': notification.get('subject').get('title'), 
        #        'sender': notification.get('repository').get('owner').get('login'), 
        #        'link': f"https://github.com/{notification.get('subject').get('url')[28:]}",
        #        'text': notification.get('subject').get('description', ''),
        #        'created_time': str(notification.get('updated_at')),
        #     })
                  
                           
        elapsed_time = time.time() - start_time                  
        print(f'Facebook notifications loaded successfully ✅ - {format_time(elapsed_time)}')
        time.sleep(1)
         
      elif response.status_code == 401 or response.status_code == 403:
         raise Exception(f"Error {response.status_code}: Unauthorized or Forbidden")
         
    try:
        asyncio.run(fetch_facebook_notifications())
    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return ['error', str(e)]
    
    return ['success', messages]       
   

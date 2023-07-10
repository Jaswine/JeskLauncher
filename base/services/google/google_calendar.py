import requests
import asyncio

def CallendarService(email_list, access_token):
   async def fetch_callendar():
      response_calendar = requests.get('https://www.googleapis.com/calendar/v3/calendars/primary/events', params={
         'access_token': access_token,
         'maxResults': 10
      })
      events = response_calendar.json().get('items', [])
      for event in events:
         email_list.append({
            'id': event['id'],
            'type': 'google_event',
            'title':  event['summary'], 
            'sender' : '',
            'link': f"https://calendar.google.com",
            'text': event['description'],
            'created_time': event['created'][:-5]
         })
         
      return email_list
   
   asyncio.run(fetch_callendar())
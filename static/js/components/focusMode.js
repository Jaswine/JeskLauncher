document.addEventListener('DOMContentLoaded', () => {
   let FocusMode = document.querySelector('#FocusMode')

   let callender__top = document.querySelector('.callender__top')
   let callendar__sound = document.querySelector('.callendar__sound')
   let calendar__place = document.querySelector('.calendar__place')
   let callendar__place = document.querySelector('.callendar__place')

   let inbox = document.querySelector('.inbox')
   let today = document.querySelector('.today') 
   let callendar = document.querySelector('.calendar')

   let callender__panel = document.querySelector('.callender__panel')

   FocusMode.onclick = () => {
      console.log('focus')

      if (today.style.maxWidth == '100%') {
         console.log('Exiting focus')
         // inbox.style.opacity = 1

         // callender__top.style.opacity = 1
         // callendar__sound.style.opacity = 1
         // calendar__place.style.opacity = 1
         // callendar__place.style.opacity = 1

         today.style.maxWidth = '50%'
         inbox.style.maxWidth = '25%'
         callendar.style.maxWidth = '25%'

         callender__panel.classList.remove('callender__panel__focusmode')
      } else {
         // inbox.style.opacity = 0

         // callender__top.style.opacity = 0
         // callendar__sound.style.opacity = 0
         // calendar__place.style.opacity = 0
         // callendar__place.style.opacity = 0

         today.style.maxWidth = '100%'
         inbox.style.maxWidth = 0
         callendar.style.maxWidth = 0

         callender__panel.classList.add('callender__panel__focusmode')
         
      }
   }
})
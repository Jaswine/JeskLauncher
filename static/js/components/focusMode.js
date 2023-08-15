document.addEventListener('DOMContentLoaded', () => {
   let FocusMode = document.querySelector('#focusMode')

   let inbox = document.querySelector('.inbox')
   let today = document.querySelector('.today') 
   let calendar = document.querySelector('.calendar')

   function openFocusMode() {
      today.style.maxWidth = '100%'
      inbox.style.maxWidth = 0
      calendar.style.maxWidth = 0
   
      document.querySelector('.calendar__footer').classList.add('callender__panel__focusmode')
   }
   
   function closeFocusMode() {
      today.style.maxWidth = '50%'
      inbox.style.maxWidth = '25%'
      calendar.style.maxWidth = '25%'
   
      document.querySelector('.calendar__footer').classList.remove('callender__panel__focusmode')
   }

   // click on the special buttons on keyboard
   document.addEventListener('keydown', (e) => {
      if (e.ctrlKey + e.key === 'f') {
         if (today.style.maxWidth == '100%') {
            closeFocusMode()
         } else {
            openFocusMode()
         }
      }
      if (e.key === 'Escape') {
         closeFocusMode()
      }
  })

   // click on the button "Focus Mode"
   FocusMode.onclick = () => {
      if (today.style.maxWidth == '100%') {
         closeFocusMode()
      } else {
         openFocusMode()
      }
   }
})
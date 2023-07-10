document.addEventListener('DOMContentLoaded', () => {
   let FocusMode = document.querySelector('#FocusMode')

   let inbox = document.querySelector('.inbox')

   let callender__top = document.querySelector('.callender__top')
   let callendar__sound = document.querySelector('.callendar__sound')
   let calendar__place = document.querySelector('.calendar__place')
   let callendar__place = document.querySelector('.callendar__place')


   FocusMode.onclick = () => {
      console.log(inbox.style.opacity )
      if (inbox.style.opacity == 0) {
         inbox.style.opacity = 1

         callender__top.style.opacity = 1
         callendar__sound.style.opacity = 1
         calendar__place.style.opacity = 1
         callendar__place.style.opacity = 1
      } else {
         inbox.style.opacity = 0

         callender__top.style.opacity = 0
         callendar__sound.style.opacity = 0
         calendar__place.style.opacity = 0
         callendar__place.style.opacity = 0
      }
   }
})
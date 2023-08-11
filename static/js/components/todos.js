// Open the inbox and Close
const notes_button = document.querySelectorAll('.inbox__tasks__menu__button')
const show_notes= document.querySelectorAll('.inbox__backlog__notes__show')

const inbox__notifications = document.querySelector('.inbox__notifications')
const today__work = document.querySelector('.today__work')


for (let i = 0; i < notes_button.length; i++) {
   // let show_note_status = localStorage.getItem(`show_notes_notifications${i}`)
   
   // if (show_note_status) {
   //    show_notes[i].style.height = show_note_status
   // }

   notes_button[i].onclick = () => {
      if  (show_notes[i].style.height == '76vh') {
         if (i == 0) {
            inbox__notifications.style.height = '100%'

            show_notes[i].style.height = '0vh'
            // localStorage.setItem(`show_notes_notifications${i}`, '12vh')
         } else if (i == 1) {
            today__work.style.height = '100%'

            show_notes[i].style.height = '12vh'
            // localStorage.setItem(`show_notes_notifications${i}`, '0vh')
         }
      } else {
         show_notes[i].style.height = '76vh'
         // localStorage.setItem(`show_notes_notifications${i}`, '76vh')

         if (i == 0) {
            inbox__notifications.style.height = '10%'
         } else if (i == 1) {
            today__work.style.height = '10%'
         }
      }
   } 
}



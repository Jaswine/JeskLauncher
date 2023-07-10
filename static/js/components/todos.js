// Open the inbox and Close
const notes_button = document.querySelectorAll('.inbox__tasks__menu__button')
const notifications = document.querySelectorAll('.column__notifications')
const show_notes= document.querySelectorAll('.inbox__show__tasks')


for (let i = 0; i < notes_button.length; i++) {
   let show_note_status = localStorage.getItem(`show_notes_notifications${i}`)
   
   if (show_note_status) {
      show_notes[i].style.height = show_note_status
   }

   notes_button[i].onclick = () => {
      if  (show_notes[i].style.height == '12vh') {
         show_notes[i].style.height = '76vh'
         localStorage.setItem(`show_notes_notifications${i}`, '76vh')
      } else {
         show_notes[i].style.height = '12vh'
         localStorage.setItem(`show_notes_notifications${i}`, '12vh')
      }
   } 
}



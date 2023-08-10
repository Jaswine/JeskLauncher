// const messages = document.querySelectorAll('.message');
// const message_closes = document.querySelectorAll('.message_close');

// // Close Message When U Click on Button
// for (let i=0; i<message_closes.length; i++) {
//    message_closes[i].onclick = () => {
//       messages[i].style.display = 'none';
//    }
//    setTimeout(() => {
//       messages[i].style.display = 'none';
//    },  3000+(i*400))
// }

// // Close Message When U Click on Escape or Delete
// addEventListener('keydown', (e) => {
//    let note__form = document.querySelector('.note__form')
//    // let settings__form = document.querySelector('.settings')
   
//    closeNoteForm(note__form)
//    // closeNoteForm(settings__form)

//    for (let i=0; i<messages.length; i++) {
//       if (e.key === 'Delete' || e.key === 'Escape') {
//          messages[i].style.display = 'none';
//       }
//    }
// })
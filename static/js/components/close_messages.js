const messages = document.querySelectorAll('.message');
const message_closes = document.querySelectorAll('.message_close');

// Close Message When you Click on Button
for (let i=0; i<message_closes.length; i++) {
   message_closes[i].onclick = () => {
      messages[i].style.display = 'none';
   }
   setTimeout(() => {
      messages[i].style.display = 'none';
   },  4000+(i*400))
}

// Close Message When you Click on Escape or Delete
addEventListener('keydown', (e) => {
   for (let i=0; i<messages.length; i++) {
      if (e.key === 'Delete' || e.key === 'Escape') {
         messages[i].style.display = 'none';
      }
   }
})
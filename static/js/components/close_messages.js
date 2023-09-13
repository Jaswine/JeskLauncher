// Получаем все элементы с классом 'message' и кнопки для закрытия сообщений
const messages = document.querySelectorAll('.message');
const message_closes = document.querySelectorAll('.message_close');

// Закрываем сообщение при клике на кнопку закрытия
for (let i = 0; i < message_closes.length; i++) {
   message_closes[i].onclick = () => {
      messages[i].style.display = 'none';
   }

   // Закрываем сообщение автоматически через некоторое время
   setTimeout(() => {
      messages[i].style.display = 'none';
   }, 4000 + (i * 400))
}

// Закрываем сообщение при нажатии клавиши Escape или Delete
addEventListener('keydown', (e) => {
   for (let i = 0; i < messages.length; i++) {
      if (e.key === 'Delete' || e.key === 'Escape') {
         messages[i].style.display = 'none';
      }
   }
})

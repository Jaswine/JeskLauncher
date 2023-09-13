// Код выполняется после полной загрузки страницы
document.addEventListener('DOMContentLoaded', () => {
   // Получаем элемент "Focus Mode" из HTML
   let FocusMode = document.querySelector('#focusMode');

   // Получаем элементы для управления разделами: Inbox, Today и Calendar
   let inbox = document.querySelector('.inbox');
   let today = document.querySelector('.today'); 
   let calendar = document.querySelector('.calendar');

   // Функция для открытия режима фокуса
   function openFocusMode() {
      today.style.maxWidth = '100%'; // Today занимает всю ширину
      inbox.style.maxWidth = 0; // Inbox скрыт
      calendar.style.maxWidth = 0; // Calendar скрыт

      // Добавляем класс для стилизации футера Calendar
      document.querySelector('.calendar__footer').classList.add('callender__panel__focusmode');
   }
   
   // Функция для закрытия режима фокуса
   function closeFocusMode() {
      today.style.maxWidth = '50%'; // Today занимает половину ширины
      inbox.style.maxWidth = '25%'; // Inbox занимает 25% ширины
      calendar.style.maxWidth = '25%'; // Calendar занимает 25% ширины

      // Удаляем класс для стилизации футера Calendar
      document.querySelector('.calendar__footer').classList.remove('callender__panel__focusmode');
   }

   // Обработка события нажатия клавиши на клавиатуре
   document.addEventListener('keydown', (e) => {
      // При нажатии Ctrl + F (или Cmd + F на Mac)
      if (e.ctrlKey && e.key === 'f') {
         if (today.style.maxWidth == '100%') {
            // Если режим фокуса уже открыт, то закрываем его
            closeFocusMode();
         } else {
            // В противном случае, открываем режим фокуса
            openFocusMode();
         }
      }
      // При нажатии клавиши Escape
      if (e.key === 'Escape') {
         // Закрываем режим фокуса
         closeFocusMode();
      }
  })

   // Обработчик клика на кнопку "Focus Mode"
   FocusMode.onclick = () => {
      if (today.style.maxWidth == '100%') {
         // Если режим фокуса уже открыт, то закрываем его
         closeFocusMode();
      } else {
         // В противном случае, открываем режим фокуса
         openFocusMode();
      }
   }
})

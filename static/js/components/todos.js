// Получаем кнопки "Open" для открытия списка задач
const notes_button = document.querySelectorAll('.inbox__tasks__menu__button');

// Получаем список заметок, который нужно отобразить/скрыть
const show_notes = document.querySelectorAll('.inbox__backlog__notes__show');

// Получаем элементы, которые нужно управлять при открытии/закрытии заметок
const inbox__notifications = document.querySelector('.inbox__notifications');
const today__work = document.querySelector('.today__work');

// Проходим по всем кнопкам "Open"
for (let i = 0; i < notes_button.length; i++) {
   // Добавляем обработчик клика на каждую кнопку
   notes_button[i].onclick = () => {
      // Проверяем текущую высоту списка заметок
      if (show_notes[i].style.height == '76vh') {
         // Если высота равна 76vh, то скрываем заметки
         if (i == 0) {
            inbox__notifications.style.height = '100%';
            show_notes[i].style.height = '0vh';
         } else if (i == 1) {
            today__work.style.height = '100%';
            show_notes[i].style.height = '12vh';
         }
      } else {
         // Если высота не равна 76vh, то открываем заметки
         show_notes[i].style.height = '76vh';
         
         if (i == 0) {
            inbox__notifications.style.height = '10%';
         } else if (i == 1) {
            today__work.style.height = '10%';
         }
      }
   };
}

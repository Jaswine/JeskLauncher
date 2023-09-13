// Получаем элемент календаря
const calendar = document.querySelector('#calendar_body');

// Получаем текущую дату
const currentDate = new Date();

// Функция для создания календаря
function createCalendar(elem, year, month) {
   // Определяем номер месяца (месяцы идут с 0 до 11)
   let mon = month - 1;
   // Создаем объект даты для указанного года и месяца
   let d = new Date(year, mon);

   // Создаем начало таблицы календаря
   let table = '<table><tr class="first_tr"><th>Mo</th><th>Tu</th><th>We</th><th>Th</th><th>Fr</th><th>Sa</th><th>Su</th></tr><tr>';

   // Добавляем пробелы для первого ряда, с понедельника до первого дня месяца
   for (let i = 0; i < getDay(d); i++) {
      table += '<td></td>';
   }

   // Заполняем таблицу календаря датами
   while (d.getMonth() == mon) {
     table += `<td class=${d.getDate() == currentDate.getDate() ? 'active': '' }>` + d.getDate() + '</td>';

     if (getDay(d) % 7 == 6) { // Воскресенье - перевод строки
       table += '</tr><tr>';
     }

     d.setDate(d.getDate() + 1);
   }

   // Завершаем таблицу пустыми ячейками, если нужно
   if (getDay(d) != 0) {
     for (let i = getDay(d); i < 7; i++) {
       table += '<td></td>';
     }
   }

   // Закрываем таблицу
   table += '</tr></table>';

   // Вставляем таблицу в указанный элемент
   elem.innerHTML = table;
 }

 // Функция для получения номера дня недели (от 0 - понедельник, до 6 - воскресенье)
 function getDay(date) {
   let day = date.getDay();
   if (day == 0) day = 7; // Переводим воскресенье (0) в последний день (7)
   return day - 1;
 }

 // Получаем элементы для управления календарем (левая и правая стрелки, заголовок месяца)
 const callendar__header = document.querySelector('#calendar_header');
 const left = document.createElement('left');
 const right = document.createElement('right');
 const h3 = document.createElement('h3');

 // Добавляем содержимое для элементов управления
 left.innerHTML = '<i class="fa-solid fa-chevron-left"></i>';
 right.innerHTML = '<i class="fa-solid fa-chevron-right"></i>';

 // Инициализируем месяц и год текущей датой
 let month = currentDate.getMonth();
 let year = currentDate.getFullYear();

 // Обработчики кликов на левую и правую стрелки для переключения месяцев
 left.onclick = () => {
   month--;

   if (month == -1) {
    month = 11;
    year--;
   } 

   // Обновляем заголовок месяца и создаем календарь для нового месяца
   monthRender(h3, month);
   createCalendar(calendar, year, month + 1);
 }

 right.onclick = () => {
   month++;

   if (month == 12) {
    month = 0;
    year++;
   } 

   // Обновляем заголовок месяца и создаем календарь для нового месяца
   monthRender(h3, month);
   createCalendar(calendar, year, month + 1);
 }

 // Функция для отображения названия месяца и года в заголовке
 const monthRender = (place, number) => {
   let monthNames = [
      'January', 'February', 'March', 'April',
      'May', 'June', 'July', 'August',
      'September', 'October', 'November', 'December'
    ];

   place.innerHTML = `
   ${monthNames[number]} 
   ${year}
   `
}

 // Инициализируем заголовок месяца и создаем календарь для текущего месяца
monthRender(h3, month);
createCalendar(calendar, year, month + 1);

 // Добавляем элементы управления календарем в заголовок
callendar__header.append(left, h3, right);

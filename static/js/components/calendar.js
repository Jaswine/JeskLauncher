function createCalendar(elem, year, month) {

   let mon = month - 1; // месяцы в JS идут от 0 до 11, а не от 1 до 12
   let d = new Date(year, mon);

   let table = '<table><tr class="first_tr"><th>M</th><th>T</th><th>W</th><th>T</th><th>F</th><th>S</th><th>S</th></tr><tr>';

   // пробелы для первого ряда
   // с понедельника до первого дня месяца
   // * * * 1  2  3  4
   for (let i = 0; i < getDay(d); i++) {
     table += '<td></td>';
   }

   // <td> ячейки календаря с датами
   while (d.getMonth() == mon) {
     table += '<td>' + d.getDate() + '</td>';

     if (getDay(d) % 7 == 6) { // вс, последний день - перевод строки
       table += '</tr><tr>';
     }

     d.setDate(d.getDate() + 1);
   }

   // добить таблицу пустыми ячейками, если нужно
   // 29 30 31 * * * *
   if (getDay(d) != 0) {
     for (let i = getDay(d); i < 7; i++) {
       table += '<td></td>';
     }
   }

   // закрыть таблицу
   table += '</tr></table>';

   elem.innerHTML = table;
 }

 function getDay(date) { // получить номер дня недели, от 0 (пн) до 6 (вс)
   let day = date.getDay();
   if (day == 0) day = 7; // сделать воскресенье (0) последним днем
   return day - 1;
 }

 const callendar__header = document.querySelector('#callendar__header')

 const left = document.createElement('left')
 const right = document.createElement('right')
 const h3 = document.createElement('h3')

 left.innerHTML = '<'
 right.innerHTML = '>'

 const currentDate = new Date()

 let month = currentDate.getMonth()
 let year = currentDate.getFullYear()

 left.onclick = () => {
  //  console.log('left')

   month--

   if (month == 0 ) {
    month = 11
    year--
   } 

   monthRender(h3, month)
   createCalendar(calendar, year, month+1);
 }

 right.onclick = () => {
  //  console.log('right')

   month++

   if (month == 12 ) {
    month = 0
    year++
   } 

   monthRender(h3, month)
   createCalendar(calendar, year, month+1);
 }

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

 monthRender(h3, month)
 createCalendar(calendar, year, month+1);

callendar__header.append(left, h3, right)

// const callendar__place__input = document.querySelector('.callendar__place__input')

// callendar__place__input.addEventListener('change', (e) => {
//   // console.log(e.target.value)

//   year = e.target.value

//   monthRender(h3, month)
//   createCalendar(calendar, year, month+1);
// })
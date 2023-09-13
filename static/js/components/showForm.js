// Код выполняется после загрузки содержимого страницы
document.addEventListener('DOMContentLoaded', () => {
   // Получаем элемент кнопки для выбора типа мотивации
   const motivate_button = document.querySelector('#motivation_type');

   // Получаем место, где будет отображаться мотивация
   const motivation__place = document.querySelector('.calendar__motivation__place');

   // Функция для отображения мотивации в виде текста
   const MotivationText = () => {
      // Устанавливаем значение кнопки на "text"
      motivate_button.value = 'text';

      // Заполняем место для мотивации текстовым полем
      motivation__place.innerHTML = `
         <textarea name="" id="upload_text">${localStorage.getItem('motivation_type') == 'text' ? localStorage.getItem('motivation_type_text'): 'THIS CAN BE YOUR MOTIVATION OR USEFUL TEXT'}</textarea>
      `;

      // Сохраняем выбранный тип мотивации и текст в локальное хранилище
      localStorage.setItem('motivation_type', 'text');
      localStorage.setItem('motivation_type_text', motivation__place.querySelector('#upload_text').value);
   };

   // Функция для отображения мотивации в виде изображения
   const MotivationImage = () => {
      // Устанавливаем значение кнопки на "image"
      motivate_button.value = 'image';

      // Заполняем место для мотивации загрузочным полем изображения
      motivation__place.innerHTML = `
         <div class='motivation__place__image'>
            <input type="file" name="image" id="upload_image" />
            <div class='motivation__place__uploaded__image'>
               <i class="fa-regular fa-image"></i>
            </div>
         </div>
      `;

      // Добавляем обработчик события изменения файла для загрузки изображения
      document.querySelector('#upload_image').addEventListener('change', (event) => {
         const file = event.target.files[0];

         if (file) {
            const reader = new FileReader();
            const place = document.querySelector('.motivation__place__uploaded__image');

            reader.onload = (e) => {
               const img = document.createElement('img');
               img.src = e.target.result;
               place.appendChild(img);
            };

            reader.readAsDataURL(file);
         }
      });

      // Сохраняем выбранный тип мотивации в локальное хранилище
      localStorage.setItem('motivation_type', 'image');
   };

   // Проверяем текущий тип мотивации в локальном хранилище и отображаем его
   if (localStorage.getItem('motivation_type') == 'image') {
      MotivationImage();
   } else {
      MotivationText();
   }

   // Добавляем обработчик клика на кнопку для выбора типа мотивации
   motivate_button.addEventListener('click', (e) => {
      if (e.target.value == 'text') {
         MotivationText(); // Переключаемся на текстовый вид мотивации
      } else {
         MotivationImage(); // Переключаемся на вид мотивации с изображением
      }
   });
});

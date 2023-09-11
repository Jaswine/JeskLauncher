document.addEventListener('DOMContentLoaded', () => {
   const motivate_button = document.querySelector('#motivation_type')
   const motivation__place = document.querySelector('.calendar__motivation__place')

   const MotivationText = () => {
      motivate_button.value = 'text'

      motivation__place.innerHTML = `
            <textarea name="" id="upload_text">${localStorage.getItem('motivation_type') == 'text' ? localStorage.getItem('motivation_type_text'): 'THIS CAN BE YOUR MOTIVATION OR USEFUL TEXT'}</textarea>
         `

         localStorage.setItem('motivation_type', 'text')
         localStorage.setItem('motivation_type_text', motivation__place.querySelector('#upload_text').value)
   }

   const MotivationImage = () => {
      motivate_button.value = 'image'
      
      motivation__place.innerHTML = `
         <div class='motivation__place__image'>
            <input type="file" name="image" id="upload_image" />
            <div class='motivation__place__uploaded__image'>
               <i class="fa-regular fa-image"></i>

            </div>
         </div>
      `

      document.querySelector('#upload_image').addEventListener('change', (event) => {
         const file = event.target.files[0];
         
         if (file) {
            const reader = new FileReader();
            const place = document.querySelector('.motivation__place__uploaded__image')

            reader.onload = (e) => {
            const img = document.createElement('img')
            img.src = e.target.result; 
            place.appendChild(img)
            };
         
            reader.readAsDataURL(file);
         }
      });

      localStorage.setItem('motivation_type', 'image')
   }
   
   if (localStorage.getItem('motivation_type') == 'image') {
      MotivationImage()
   } else {
      MotivationText()
   }

   motivate_button.addEventListener('click', (e) => {
      if (e.target.value == 'text') {
         MotivationText()
      } else {
         MotivationImage()
      }
   })


})
const place = document.querySelector('.callendar__place__content')
const place2 = document.querySelector('.callendar__place__content2')

// let upload_motivate_image = document.querySelector('#upload_motivate_image')

const text__type = document.querySelector('#text__type')
const image__type = document.querySelector('#image__type')

// const getData = async () => {
//    let request = await fetch('http://127.0.0.1:8000/api/update-profile', {
//       method: 'GET',
//    })
//    let data = await request.json()
//    console.log(data)
// }

// getData()

const motivateType = localStorage.getItem('motivateType')
//! LocalStorage Checking 
if (motivateType) {
   stayContent(motivateType)
} else {
   stayContent('text')
}

// motivate_type.addEventListener('change', (e) => {
//    stayContent(e.target.value)
// })

// stayContent('text')

image__type.addEventListener('change', (e) => {
   if (image__type.checked) {
      stayContent('image')
   } else {
      // place.innerHTML = ''
      UploadMotivateImageHidden()
   }
})

text__type.addEventListener('change', (e) => {
   if (text__type.checked) {
      stayContent('text')
      document.querySelector('.motivateText').style.display = 'block'
      // UploadMotivateImageHidden()
   } else {
      document.querySelector('.motivateText').style.display = 'none'
   }
})


function stayContent(type) {
   if (type == 'text') {
      let getMotivateText = localStorage.getItem('motivateText')

      if (getMotivateText == null || getMotivateText== '' || getMotivateText == ' ') {
         getMotivateText = ''
      }

      // UploadMotivateImageHidden()

      place2.innerHTML = `
         <textarea class='motivateText' placeholder='Your Motivate Text...'>${getMotivateText}</textarea>
      `
      addToLocalStorage('motivateType', 'text')

      let motivateText = document.querySelector('.motivateText') 

      motivateText.addEventListener('change', (e) => {
         localStorage.setItem('motivateText', e.target.value)
      })
   } else if (type == 'image') {
      let getMotivateImage = localStorage.getItem('motivateImage')

      // console.log(getMotivateImage)

      try {
         // console.log(getMotivateImage)
         const binary = atob(getMotivateImage.split(',')[1]);

         // Создание объекта Blob и URL
         const blob = new Blob([binary], {type: 'image/jpeg'});
         const url = URL.createObjectURL(blob);
      } catch (e) {
         console.error('Decode error: ' + e);
         getMotivateImage = 'https://images.pexels.com/photos/6643000/pexels-photo-6643000.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
      }
      
      place.innerHTML = `
         <input type="file" id="upload_motivate_image" >
         <img src="${getMotivateImage}" alt="" class='motivateImage' />
      `
      UploadMotivateImageShow()

      let motivateImage = document.querySelector('.motivateImage')
      imageScale(motivateImage)
      let upload_motivate_image = document.querySelector('#upload_motivate_image')

      if (upload_motivate_image !== null) {
         upload_motivate_image.addEventListener('change', (e)  => {
            let file = e.target.files[0]
   
            let fileURL = URL.createObjectURL(file);
            motivateImage.src = fileURL
            
            // console.log(motivateImage)
            const canvas = document.createElement('canvas');
            canvas.width = motivateImage.width;
            canvas.height = motivateImage.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(motivateImage, 0, 0);
            const base64 = canvas.toDataURL('image/jpeg');

            localStorage.setItem('motivateImage',base64 )
         })
      }

      addToLocalStorage('motivateType', 'image')
   }
}

// ! Add To Local Storage Function
function addToLocalStorage(key, param) {
   localStorage.setItem(key, param)
}

// //! Function for Scale Image
function imageScale(motivateImage) {
   motivateImage.addEventListener('click', () => {
      if (motivateImage.style.width == '100%') {
         motivateImage.style.width = 'auto';
         motivateImage.style.cursor = 'zoom-in';
      } else {
         motivateImage.style.width = '100%'
         motivateImage.style.cursor = 'zoom-out';
      }
   })
}

function UploadMotivateImageShow() {
   document.querySelector('.motivateImage').style.display = 'block'
   upload_motivate_image.style.display = 'block'
   setTimeout(() => {
      upload_motivate_image.style.opacity = 1
   }, 100)
}
function UploadMotivateImageHidden() {
   document.querySelector('.motivateImage').style.display = 'none'
   upload_motivate_image.style.display = 'none'
   setTimeout(() => {
      upload_motivate_image.style.opacity = 0
   }, 100)
}
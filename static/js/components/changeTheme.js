document.addEventListener('DOMContentLoaded', () => {
   const borderBottomElements = document.querySelectorAll('[style*="border-bottom: 1px solid rgb(20,20,20,.3)"]')
   const borderRightElements = document.querySelectorAll('[style*="border-right: 1px solid rgb(20,20,20,.3)"]')
   const borderLeftElements = document.querySelectorAll('[style*="border-left: 1px solid rgb(20,20,20,.3)"]')
   const borderElements = document.querySelectorAll('[style*="border: 1px solid rgb(20,20,20,.3)"]')
   const backgroundColorElements = document.querySelectorAll('[style*="background-color: rgb(248, 248, 255)"]')
   const colorElements = document.querySelectorAll('[style*="color: #202020"]')

   // elements 
   const inputElements = document.querySelectorAll('input')
   const aElements = document.querySelectorAll('a')
   const options = document.querySelectorAll('option')
   const note__formElements = document.querySelectorAll('.note__form')

   // panel
   const accountsElements = document.querySelectorAll('.accounts')

   // some elements
   const page__left__mask = document.querySelectorAll('.page__left__mask')
   const message = document.querySelectorAll('.message')


   // TODO: get from local storage
   let theme = localStorage.getItem('theme')

   if (theme == 'dark' || theme == 'light') {
      changeTheme(theme)
   }

   // TODO: event listener
   document.getElementById('theme').addEventListener('click', changeTheme)


   // TODO: change theme
   function changeTheme(nowTheme = undefined) {
      let comp = document.body.style.color == 'ghostwhite'

      if (nowTheme != undefined) {
         if (nowTheme == 'dark') {
            comp = false
         } else if (nowTheme == 'light') {
            comp = true
         }
      }

      if (comp) {
         // TODO: ____________ light theme ______________

         localStorage.setItem('theme', 'light')

         document.body.style.color = '#202020'
         document.body.style.backgroundColor = 'ghostwhite'

         changeStyle('1px solid rgb(0,0,0,.3)',borderBottomElements, 'borderBottom')
         changeStyle('1px solid rgb(0,0,0,.3)',borderRightElements, 'borderRight')
         changeStyle('1px solid rgb(0,0,0,.3)',borderLeftElements, 'borderLeft')
         changeStyle('1px solid rgb(0,0,0,.3)',borderElements, 'border')
         changeStyle('rgb(248, 248, 255)', backgroundColorElements, 'backgroundColor')
         changeStyle('#202020', colorElements, 'color')

         changeStyle('#202020',inputElements, 'color')
         changeStyle('#202020',aElements, 'color')
         changeStyle('rgb(248, 248, 255, 1)', options ,'backgroundColor')

         changeStyle('ghostwhite',accountsElements, 'backgroundColor')

         changeStyle('rgb(248, 248, 255,.6)',page__left__mask, 'backgroundColor')
         changeStyle('rgb(248, 248, 255, 1)', message ,'backgroundColor')
         changeStyle('rgb(248, 248, 255)', note__formElements, 'backgroundColor')
      } else {
         // TODO:  ____________ dark theme ___________

         localStorage.setItem('theme', 'dark')


         document.body.style.color = 'ghostwhite'
         document.body.style.backgroundColor = '#202020'

         changeStyle('1px solid rgb(248, 248, 255, .3)',borderBottomElements, 'borderBottom')
         changeStyle('1px solid rgb(248, 248, 255, .3)',borderRightElements, 'borderRight')
         changeStyle('1px solid rgb(248, 248, 255, .3)',borderLeftElements, 'borderLeft')
         changeStyle('1px solid rgb(248, 248, 255, .3)',borderElements, 'border')
         changeStyle('rgb(20,20,20,1)', backgroundColorElements, 'backgroundColor')
         changeStyle('rgb(248, 248, 255)', colorElements, 'color')

         changeStyle('ghostwhite',inputElements, 'color')
         changeStyle('ghostwhite',aElements, 'color')

         changeStyle('#202020', options ,'backgroundColor')

         changeStyle('#202020',accountsElements, 'backgroundColor')
         
         changeStyle('rgb(20, 20, 20,.6)',page__left__mask, 'backgroundColor')
         changeStyle('#202020',message ,'backgroundColor')
         changeStyle('#202020', note__formElements, 'backgroundColor')
      }
   }

   // TODO: Change style
   function changeStyle(
      color = 'rgb(20,20,20,.3)', 
      elements = [],
      option = null
   ) {
      for (let element of elements) {
         if (option) {
            element.style[option] = color
         }
      }
   }
})
document.addEventListener('DOMContentLoaded', () => {
   // Функция для перезаписи токенов
   const rewrite_tokens = () => {
      console.log('Rewriting tokens...')
      // Выполняем GET-запрос к серверу по адресу '/api/rewrite-tokens'
      fetch('/api/rewrite-tokens')
         .then(response => response.json())
         .then(data => {
            // Выводим полученные данные в консоль браузера
            console.log(data);
         })
         .catch(error => {
            // В случае ошибки выводим её в консоль браузера
            console.error(error);
         })
   }

   rewrite_tokens()

   setInterval(() => {
      rewrite_tokens()
   },  2400000)
});

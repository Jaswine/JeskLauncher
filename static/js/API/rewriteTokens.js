document.addEventListener('DOMContentLoaded', () => {
   const rewrite_tokens = () => {
      fetch('/api/rewrite-tokens')
         .then(response => response.json())
         .then(data => {
            console.log(data)
         })
         .catch(error => {
            console.error(error)
         })
   }

   rewrite_tokens()
})
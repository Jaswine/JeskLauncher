const accounts = document.querySelector('.accounts')

document.querySelector('#open_account').addEventListener('click', () => {
   accounts.style.display = 'flex';

   setTimeout(() => {
      accounts.style.opacity = '1';
   }, 300)
})

document.querySelector('.close__accounts').onclick = () => {
   accounts.style.opacity = '0'

   setTimeout(() => {
   accounts.style.display = 'none'
   }, 300)
}
const accounts = document.querySelector('.accounts');
const close_accounts = document.querySelector('.close__accounts');
const open_account = document.querySelector('#open_account');

// accounts.style.display = 'flex';
// accounts.style.opacity = '1';


open_account.addEventListener('click', () => {
   accounts.style.display = 'flex';

   setTimeout(() => {
      accounts.style.opacity = '1';
   }, 300)
})

close_accounts.onclick = () => {
   accounts.style.opacity = '0'

   setTimeout(() => {
   accounts.style.display = 'none'
   }, 300)
}
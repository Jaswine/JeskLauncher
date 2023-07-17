const settings = document.querySelector('.settings')
const settings_button = document.querySelector('#settings')
const close__settings = document.querySelector('.close__settings')

settings_button.addEventListener('click', () => {
    if (settings.style.display == 'none') {
        settings.style.display = 'flex'
    } else {
        settings.style.display = 'none'
    }
})

close__settings.addEventListener('click', () => {
    settings.style.display = 'none'
})
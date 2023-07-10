
let chill__mode = document.querySelector('#chill__mode')

// columns
let today = document.querySelector('.today')
let inbox = document.querySelector('.inbox')
let calendarChillMode = document.querySelector('.calendar')

// buttons
let ChillMode = document.querySelector('#ChillMode')
let close__chill__mode = document.querySelector('.close__chill__mode')

// options
let chill__phone__intro__title = document.querySelector('.chill__phone__intro__title')
let chill__phone__date = document.querySelector('.chill__phone__date')
let chill__phone__time = document.querySelector('.chill__phone__time')
let interval


// open Chill Mode when you click on button
ChillMode.onclick = openChillMode

// close Chill Mode when you click on button
close__chill__mode.onclick = closeChillMode

// close Chill Mode when you click on Escape
document.addEventListener('keydown', (e) => {
    // if (e.key === 'm') {
        // openChillMode()
    // }
    if (e.key === 'Escape') {
        closeChillMode()
    }
})

// render data
let date =  new Date()

let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
let weeksDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

chill__phone__date.innerHTML = date.getDate() + ' ' + (months[date.getMonth()]) + ' ' + date.getFullYear()
chill__phone__intro__title.innerHTML = weeksDays[date.getDay()]


// render Time for Chill Mode
function renderTime() {
    interval = setInterval(() => {
      const date = new Date();
      chill__phone__time.innerHTML = '- ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds() + ' -';
    }, 1000);
  }

// stop Render Time for Chill Mode
function stopRenderTime() {
    clearInterval(interval);
}

// Close Chill Mode
function closeChillMode() {
    chill__mode.style.display = 'none'
    chill__mode.style.opacity = 0
    stopRenderTime()

    setTimeout(() => {
        calendarChillMode.style.opacity = 1
        today.style.opacity = 1
        inbox.style.opacity = 1
    }, 250)

    localStorage.setItem('chill__mode', false)
}

// open Chill Mode
function openChillMode() {
    calendarChillMode.style.opacity = 0
    today.style.opacity = 0
    inbox.style.opacity = 0

    setTimeout(() => {
        renderTime()
        chill__mode.style.display = 'block'
        chill__mode.style.opacity = 1
    }, 300)

    localStorage.setItem('chill__mode', true)
}
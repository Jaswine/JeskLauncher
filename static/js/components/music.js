let button = document.querySelector('#NatureSounds')

// let NatureSoundsText = document.querySelector('#NatureSoundsText')
let wind = document.querySelector('.callendar__window')

let NatureSoundsAudio = document.querySelector('#NatureSoundsAudio')
let NatureSoundsSelect = document.querySelector('#NatureSoundsSelect')

// Open menu when you click
button.onclick = () => {
   if (wind.style.display == 'none') {
      wind.style.display = 'flex';

      setTimeout(() => {
         wind.style.opacity = '1';
      }, 200)

   } else {
      wind.style.opacity = '0';

      setTimeout(() => {
         wind.style.display = 'none';
      }, 200)
   }
}

// play sound when you change from select
NatureSoundsSelect.addEventListener('change', (e) => {
   NatureSoundsAudio.src = e.target.value
   NatureSoundsAudio.play()
});

// play sound when it was stopped
NatureSoundsAudio.addEventListener('ended', function() {
   this.currentTime = 0;
   this.play();
});

// timer
const runTimer = document.querySelector('#runTimer')
const restartTime = document.querySelector('#restartTime')

const getMinutes = document.querySelector('#getMinutes')
const getSeconds = document.querySelector('#getSeconds')

let minutes = 0
let seconds = 0

// get minut
getMinutes.addEventListener('change', (e) => {
   let val = e.target.value
   num = checking(val, getMinutes)

   getMinutes.innerHTML = padZero(val)
   minutes = val
})

// get seconds
getSeconds.addEventListener('change', (e) => {
   let val = e.target.value
   num = checking(val, getSeconds)

   getSeconds.innerHTML = padZero(val)
   seconds = val
})

getMinutes.innerHTML = padZero(minutes)
getSeconds.innerHTML = padZero(seconds)

let IntervalId
let timer_status = true

runTimer.addEventListener('click', (e) => {
   if (minutes < 0 || seconds < 0) {
      minutes = seconds = 0
   }
   if (timer_status) {
      IntervalId = setInterval(()=> {
         if (seconds == 0 && minutes == 0) {

            minutes = seconds = 0

            getMinutes.value = 0
            getSeconds.value = 0
            button.innerHTML = `${padZero(minutes)} : ${padZero(seconds)}`

            clearInterval(IntervalId)

            console.log('Chill Mode!!!!!')
            openChillMode()
            
            NatureSoundsAudio.play()
         } else {
            if (seconds == 0) {
               seconds = 60
               minutes--
            }
            seconds--
            console.log(minutes, seconds)
   
            getMinutes.value = padZero(minutes)
            getSeconds.value = padZero(seconds)
   
            button.innerHTML = `${padZero(minutes)} : ${padZero(seconds)}`
         }
      },  1000)

      timer_status = false
      runTimer.innerHTML = '<i class="fa-solid fa-pause"></i>'
   } else {
      clearInterval(IntervalId)
      timer_status = true
      runTimer.innerHTML = '<i class="fa-solid fa-play"></i>'
   }
})

restartTime.addEventListener('click', () => {
   clearInterval(IntervalId)

   minutes = 5
   seconds = 0

   getMinutes.value = padZero(minutes)
   getSeconds.value = padZero(seconds)
})

// For field check
function checking (value, object ) {
   if (value > 59) {
      object.value = 59
      value = 59
   }
   if (value< 0) {
      object.value = 0
      value = 0
   }

   return value
}

// For Stay Zero's
function padZero(value) {
   return value.toString().padStart(2, '0');
 }

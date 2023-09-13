// Кнопка для открытия окна звуков
let button = document.querySelector('#NatureSounds');

// Окно с выбором звуков
let wind = document.querySelector('.callendar__window');

// Аудио элемент для проигрывания звуков
let NatureSoundsAudio = document.querySelector('#NatureSoundsAudio');

// Выпадающий список для выбора звуков
let NatureSoundsSelect = document.querySelector('#NatureSoundsSelect');

// Открытие и закрытие меню звуков при клике на кнопку
button.onclick = () => {
   if (wind.style.display == 'none') {
      wind.style.display = 'flex';

      setTimeout(() => {
         wind.style.opacity = '1';
      }, 200);
   } else {
      wind.style.opacity = '0';

      setTimeout(() => {
         wind.style.display = 'none';
      }, 200);
   }
}

// Проигрывание звука при выборе из выпадающего списка
NatureSoundsSelect.addEventListener('change', (e) => {
   NatureSoundsAudio.src = e.target.value;
   NatureSoundsAudio.play();
});

// Повторное воспроизведение звука после завершения
NatureSoundsAudio.addEventListener('ended', function() {
   this.currentTime = 0;
   this.play();
});

// Таймер
const runTimer = document.querySelector('#runTimer');
const restartTime = document.querySelector('#restartTime');
const getMinutes = document.querySelector('#getMinutes');
const getSeconds = document.querySelector('#getSeconds');

let minutes = 0;
let seconds = 0;

// Установка значений минут и секунд по умолчанию
getMinutes.innerHTML = padZero(minutes);
getSeconds.innerHTML = padZero(seconds);

let IntervalId;
let timer_status = true;

// Обработчик для старта/паузы таймера
runTimer.addEventListener('click', (e) => {
   if (minutes < 0 || seconds < 0) {
      minutes = seconds = 0;
   }
   if (timer_status) {
      IntervalId = setInterval(()=> {
         if (seconds == 0 && minutes == 0) {
            minutes = seconds = 0;
            getMinutes.value = 0;
            getSeconds.value = 0;
            button.innerHTML = `${padZero(minutes)} : ${padZero(seconds)}`;
            clearInterval(IntervalId);
            openChillMode();
            NatureSoundsAudio.play();
         } else {
            if (seconds == 0) {
               seconds = 60;
               minutes--;
            }
            seconds--;
            console.log(minutes, seconds);
            getMinutes.value = padZero(minutes);
            getSeconds.value = padZero(seconds);
            button.innerHTML = `${padZero(minutes)} : ${padZero(seconds)}`;
         }
      },  1000);

      timer_status = false;
      runTimer.innerHTML = '<i class="fa-solid fa-pause"></i>';
   } else {
      clearInterval(IntervalId);
      timer_status = true;
      runTimer.innerHTML = '<i class="fa-solid fa-play"></i>';
   }
});

// Обработчик для сброса таймера
restartTime.addEventListener('click', () => {
   clearInterval(IntervalId);
   minutes = 5;
   seconds = 0;
   getMinutes.value = padZero(minutes);
   getSeconds.value = padZero(seconds);
});

// Функция для проверки введенных значений (минут и секунд)
function checking(value, object) {
   if (value > 59) {
      object.value = 59;
      value = 59;
   }
   if (value < 0) {
      object.value = 0;
      value = 0;
   }
   return value;
}

// Функция для добавления ведущих нулей к числам (паддинг)
function padZero(value) {
   return value.toString().padStart(2, '0');
}

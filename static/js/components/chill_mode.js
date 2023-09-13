// Получаем элементы для управления режимом Chill Mode и закрытием
const chillMode = document.querySelector('#chillMode');
const chillModeClose = document.querySelector('#chill__mode__exit');

// Функция для открытия Chill Mode
const openChillMode = () => {
    const chill__mode = document.querySelector('#chill__mode');

    // Скрываем все колонки с контентом
    for (const column of document.querySelectorAll('.column')) {
        column.style.opacity = 0;
    }

    // Задержка перед отображением Chill Mode
    setTimeout(() => {
        chill__mode.style.opacity = 1;
        chill__mode.style.display = 'flex';
        
        // Воспроизводим звуки природы
        NatureSoundsAudio.play();
        // Добавляем анимацию к изображению эквалайзера
        equalizer__image.classList.add('equalizer__image__animation');
    }, 300);
}

// Функция для закрытия Chill Mode
const closeChillMode = () => {
    const chill__mode = document.querySelector('#chill__mode');

    // Скрываем Chill Mode
    chill__mode.style.opacity = 0;
    chill__mode.style.display = 'none';

    // Приостанавливаем звуки природы
    NatureSoundsAudio.pause();
    // Удаляем анимацию изображения эквалайзера
    equalizer__image.classList.remove('equalizer__image__animation');

    // Восстанавливаем видимость всех колонок с контентом
    setTimeout(() => {
        for (const column of document.querySelectorAll('.column')) {
            column.style.opacity = 1;
        }
    }, 300);
}

// Назначаем обработчики кликов для кнопок открытия и закрытия Chill Mode
chillMode.onclick = openChillMode;
chillModeClose.onclick = closeChillMode;

// Получаем элементы для управления эквалайзером
const equalizer__triangle = document.querySelector('.equalizer__triangle');
const equalizer__image = document.querySelector('.equalizer__image');

// Обработчик клика на треугольнике эквалайзера
equalizer__triangle.addEventListener('click', () => {
    if (equalizer__triangle.childElementCount == 2) {
        // Если уже открыто, то закрываем звуки природы и анимацию
        equalizer__triangle.innerHTML = `
            <span class='triangle'></span>
        `;
        NatureSoundsAudio.pause();
        equalizer__image.classList.remove('equalizer__image__animation');
    } else {
        // Если закрыто, то открываем звуки природы и добавляем анимацию
        equalizer__triangle.innerHTML = `
            <span class="line"></span>
            <span class="line"></span>
        `;
        NatureSoundsAudio.play();
        equalizer__image.classList.add('equalizer__image__animation');
    }
});

// Получаем элемент для управления эквалайзером (возможно, лишний)
const equalizer__spans =  document.querySelector('.equalizer__spans');

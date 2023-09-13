// Элемент с классом "settings" (настройки)
const settings = document.querySelector('.settings');

// Кнопка, при нажатии на которую откроется настройки
const settings_button = document.querySelector('#settings');

// Кнопка для закрытия настроек
const close__settings = document.querySelector('.close__settings');

// Обработчик для кнопки открытия настроек
settings_button.addEventListener('click', () => {
    if (settings.style.display == 'none') {
        settings.style.display = 'flex'; // Отображаем настройки
    } else {
        settings.style.display = 'none'; // Скрываем настройки
    }
});

// Обработчик для кнопки закрытия настроек
close__settings.addEventListener('click', () => {
    settings.style.display = 'none'; // Скрываем настройки
});

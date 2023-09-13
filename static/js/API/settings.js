//update-settings
document.addEventListener('DOMContentLoaded', () => {
    // Получаем элементы формы и другие элементы страницы
    // Форма настроек
    let settingsForm = document.getElementById('settingsForm')
    // Место для сообщений
    let messages_place = document.querySelector('.messages')
    // Чекбокс для календаря
    let check__calendar = document.querySelector('.check__calendar')

    // Колонку Календаря
    let calendar = document.querySelector('.calendar')
    // Сегодняшний день
    let today = document.querySelector('.today')
    // Входящие сообщения
    let inbox = document.querySelector('.inbox')

    // Настройки календаря
    let calendar__settings = document.querySelector('.calendar__settings')
    // Нижний колонтитул календаря
    let calendar__footer = document.querySelector('.calendar__footer')

    // Устанавливаем начальное значение чекбокса для календаря
    check__calendar.checked = true
    
    // Обработчик изменения состояния чекбокса для календаря
    check__calendar.addEventListener('change', () => {
        if (check__calendar.checked) {

            // Если чекбокс отмечен, изменяем ширину элементов
            calendar.style.width = '25%'

            today.style.width = '50%'
            today.style.maxWidth = '50%'

            inbox.style.width = '25%'
            inbox.style.maxWidth = '25%'

            // Удаляем классы для скрытия календарных элементов
            calendar__settings.classList.remove('without_calendar')
            calendar__footer.classList.remove('without_calendar')
        } else {

            // Если чекбокс не отмечен, изменяем ширину элементов обратно
            calendar.style.width = '0%'

            today.style.width = '65%'
            today.style.maxWidth = '65%'

            inbox.style.width = '35%'
            inbox.style.maxWidth = '35%'

            // Добавляем классы для скрытия календарных элементов
            calendar__settings.classList.add('without_calendar')
            calendar__footer.classList.add('without_calendar')
        }
    })

    const open_settings = document.querySelectorAll('.open__settings')
    const close_settings = document.querySelectorAll('.close__settings')
    const settings = document.querySelectorAll('.settings')

    for (let i = 0; i < settings.length; i++) {
        open_settings[i].addEventListener('click', () => {
            settings[i].style.display = 'flex';

            setTimeout(() => {
                settings[i].style.opacity = '1';
            }, 300)
        })
        
        close_settings[i].addEventListener('click', () => {
            settings[i].style.opacity = '0'

            setTimeout(() => {
                settings[i].style.display = 'none'
            }, 300)
        })
    }

    // Получение данных настроек
    const getSettingsData = () => {
        // Отправляем GET-запрос на сервер для взятия настроек
        fetch('/api/settings')
            .then(response => response.json())
            .then(data => {
                // Обновление аватара в настройках на основе полученных данных
                document.querySelector('.calendar__settings__avatar').src = `/static/${data.data.avatar}`
            })
    }

    // Обработчик отправки формы настроек
    settingsForm.addEventListener('submit', (e) => {
        e.preventDefault()
        let formData = new FormData(settingsForm);
        
        // Отправка данных формы на сервер методом POST
        fetch('/api/settings', {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                // Получение и обновление данных настроек после успешной отправки   
                getSettingsData()

                // Закрытие модуля настроек
                document.querySelectorAll('.settings').forEach(settings => {
                    settings.style.display = 'none'
                })
            })  
            .catch(error => {
                console.error('Error:', error);
            });
    })

    // Получение и отображение данных настроек при загрузке страницы
    getSettingsData()
})
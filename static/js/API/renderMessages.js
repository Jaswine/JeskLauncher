document.addEventListener('DOMContentLoaded', () => {
    // Получаем список сообщений
    let messages_list = document.getElementById('messages-list'); 
    // Получаем контейнер для иконок социальных сетей
    let inbox_icons = document.querySelector('#inbox-icons');
    // Получаем контейнер для сегодняшних задач
    let today__work = document.querySelector('.today__work');

    let loadSeconds = 0
    
    // Функция для форматирования даты
    const FormateDate = (origDate) => {
        const originalDate = new Date(origDate)

        let day = originalDate.getDate()
        let month = originalDate.getMonth() + 1
        let hours = originalDate.getHours()
        let minutes = originalDate.getMinutes()

        month = month < 10 ? '0' + month : month
        day = day < 10 ? '0' + day : day
        hours = hours < 10 ? '0' + hours : hours
        minutes = minutes < 10 ? '0' + minutes : minutes

        return day + '.' + month + ' ' + hours + ':' + minutes
    }

    // Функция рендеринка сообщения для вывода сообщений на экране
    const renderMessage = (message, message_list) => {
        const div = document.createElement('div');

        div.classList.add('notification');
        div.id = `id${message.id}`;

        if (message.status == 'completed') {
          div.style.opacity = '.3';
        }

        const servicesWithTheAbilityToDelete = [
          'Gmail', 'Google_Todo', 'Google_Event', 
          'Microsoft_Todo', 'Microsoft_Mails', 'Microsoft_Calendar', 'Microsoft_OneNote'
        ]

        const servicesWithTheAbilityToComplete = [
          'Google_Todo', 'Microsoft_Todo', 
        ]

        div.innerHTML = `
            <h2 class="notification__title">${message.sender}</h2>
            <div class="notification__text"> ${message.title}</div>

            <div class="notification__buttons">
            <a href="${message.link}" target='_blank'>show</a>
            ${servicesWithTheAbilityToDelete.includes(message.type) ? "<a class='google_todo_delete'>del</a>" : ''}
            ${servicesWithTheAbilityToComplete.includes(message.type) ? "<a class='google_todo_accomplished'>comp</a>" : ''}
        </div>

        <span class='special__time'>
            <span>${message.account_email ? message.account_email : '' }</span>
            <span class='notification__time'>${FormateDate(message.created_time)}</span>
        </span>

        <div class="notification__content">${message.text}</div>
        <input type='hidden' class='notification_id' value='${message.id}' />
        <input type='hidden' class='socialGoogleTokenID' value='${message.social_google_token_id}' />
        <input type='hidden' class='notification__type' value='${message.type}' />
      `

      message_list.appendChild(div);
    }

    // Функция для удаления класса "inbox-show" у всех кнопок категорий
    const RemoveInboxShow = (icons) => {
        for (const icon of icons) {
          icon.classList.remove('inbox-show');
        }
    }

    // Добавляем кнопки для отображения сообщений социальных сетей
    const renderButton = (type, inbox_icons) => {
        inbox_icons.innerHTML += `
          <button class='icon' id='${type}'>
            <img src="/static/media/icons/${type}.svg" alt="${type}">
          </button>
        `;
    }

    // Функция для вывода сообщений на экране
    const renderData = (messages, messages_list) => {
        messages_list.innerHTML = ''

        messages.forEach(message => {
          renderMessage(message, messages_list)
        })
    }  

    const getMessages = async () => {
        console.log('get Messages... (v2) ')
        // Берем данные с сервера
        const response = await fetch('/api/messages/')
        const data = await response.json()
        console.log(data)
        console.log(`Data from social messages(v2) loaded successfully! Seconds: ${loadSeconds} ✅`)

        // Добавление иконки просмотра всех сообщений
        inbox_icons.innerHTML += `
        <button class='icon' id='show_all_messages'>
          <span class="material-symbols-outlined">mark_chat_unread</span>
        </button>`

        // Рендерим кнопки - иконки для отображения сообщений социальных сетей
        for (const key in data.services) {
          renderButton(key, inbox_icons);
        }

        // Берем все кнопки - иконки
        const icons = document.querySelectorAll('.icon');

        // Вывод сообщений из текущей ветки сервиса
        let inboxSavedCurrentService = localStorage.getItem('inbox-show')

        if (inboxSavedCurrentService) {
          if (data.services.hasOwnProperty(inboxSavedCurrentService) 
                &&  data.services[inboxSavedCurrentService].length > 0) {
            renderData(data.services[inboxSavedCurrentService], messages_list)
            inbox_icons.querySelector(`#${inboxSavedCurrentService}`).classList.add('inbox-show');
          }
        } else {
          // Вывод всех сообщений
          inbox_icons.querySelector(`#show_all_messages`).classList.add('inbox-show');
          renderData(data.messages, messages_list)
        }
        
        // Добавляем обработчики событий для удаления класса и показывания сообщений из социальных сетей
        for (const icon of icons) {
          icon.addEventListener('click', () => {
            RemoveInboxShow(icons);

            if (icon.id == 'show_all_messages') {
              renderData(data.messages, messages_list)
            } else if (data.services.hasOwnProperty(icon.id) &&  data.services[icon.id].length > 0) {
              renderData(data.services[icon.id], messages_list)
            }

            icon.classList.add('inbox-show');              
            localStorage.setItem('inbox-show', icon.id)
          });
        }
    }

    getMessages()   

    setInterval(() => {
        console.log('1 секунда');
        loadSeconds+= 1
    }, 1000);
})
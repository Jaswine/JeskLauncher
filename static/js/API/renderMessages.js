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

        div.innerHTML = `
            <h2 class="notification__title">${message.sender}</h2>
            <div class="notification__text"> ${message.title}</div>

            <div class="notification__buttons">
            <a href="${message.link}" target='_blank'>show</a>
            ${message.type == 'Gmail' || 
                message.type == 'Google_Todo' || 
                message.type == 'Google_Event' ||
                message.type == 'Microsoft_Todo' || 
                message.type == 'Microsoft_Mails' ||
                message.type == 'Microsoft_OneNote' ||
                message.type == 'Microsoft_Calendar' ? 
            "<a class='google_todo_delete'>del</a>" : ''}
            ${message.type == 'Google_Todo' ||
                message.type == 'Microsoft_Todo' ? 
            "<a class='google_todo_accomplished'>comp</a>" : ''}
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
        const response = await fetch('/api/messages/')
        const data = await response.json()
        console.log(`Data from social messages(v2) loaded successfully! Seconds: ${loadSeconds} ✅`)

        // Добавление иконки просмотра всех сообщений
        inbox_icons.innerHTML += `
        <button class='icon' id='show_all_messages'>
          <span class="material-symbols-outlined">
            mark_chat_unread
          </span>
        </button>`

        // Вывод всех сообщений
        renderData(data.messages, messages_list)

        for (const key in data.services) {
           renderButton(key, inbox_icons);
        }
    }

    getMessages()   

    setInterval(() => {
        console.log('1 секунда');
        loadSeconds+= 1
    }, 1000);
})
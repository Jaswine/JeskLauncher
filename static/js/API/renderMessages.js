// document.addEventListener('DOMContentLoaded', () => {
    // Получаем список сообщений
    let messages_list = document.getElementById('messages-list'); 
    // Получаем контейнер для иконок социальных сетей
    let inbox_icons = document.querySelector('#inbox-icons');
    // Получаем контейнер для сегодняшних задач
    let today__work = document.querySelector('.today__work');
    // Получаем CSRF-токен из атрибута элемента
    let csrfToken = document.getElementById('csrf-token').getAttribute('data-csrf-token');
    // Получаем контейнер для сообщений в почтовом ящике
    let inbox__messages = document.querySelector('.inbox__messages');

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
        ${message.list_id ? `<input type='hidden' class='list_id' value='${message.list_id}' />` : ''}
        ${message.calendar_id ? `<input type='hidden' class='calendar_id' value='${message.calendar_id}' />` : ''}
        ${message.type == 'Gmail' ? `<input type='hidden' class='gmail_is_liked' value='${message.is_liked}' />`: ''}
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

    // Функция для отображения сообщений социальных сетей
    const getMessages = async () => {
        console.log('get Messages... (v2) ')
        // Берем данные с сервера
        const response = await fetch('/api/messages/')
        const data = await response.json()
        console.log(data)
        console.log(`Data from social messages(v2) loaded successfully! Seconds: ${loadSeconds} ✅`)

        inbox_icons.innerHTML = ''
        messages_list.innerHTML = ''

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

        if (inboxSavedCurrentService 
            && inboxSavedCurrentService != 'show_all_messages'  
            && data.services.hasOwnProperty(inboxSavedCurrentService) 
            &&  data.services[inboxSavedCurrentService].length > 0) {
              renderData(data.services[inboxSavedCurrentService], messages_list)
              inbox_icons.querySelector(`#${inboxSavedCurrentService}`).classList.add('inbox-show');
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

    // FROM RENDER MESSAGES
    // Добавляем обработчики событий для кнопок в списке сообщений
    messages_list.addEventListener('click', (e) => {
      if (e.target.classList.contains('notification__text')) {
          let notification  = e.target.parentNode;

          let type = notification.querySelector('.notification__type').value;
          let content = notification.querySelector('.notification__content').innerHTML;

          // console.log(notification)
          today__work.innerHTML = `
            ${type == 'Gmail' ? `
              <div class='today__notification__panel'>
                <button class='today__notification__panel__start'>
                  ${notification.querySelector('.gmail_is_liked') && notification.querySelector('.gmail_is_liked').value == 'true' ? `
                  <svg width="calc((1vw + 1vw) * .65)" height="calc((1vw + 1vw) * .65)" viewBox="0 0 64 62" fill="none" xmlns="http://www.w3.org/2000/svg" id='Unstar'>
                    <path d="M32 3.7082L37.4538 20.4934C38.2571 22.9656 40.5608 24.6393 43.1602 24.6393H60.8092L46.5308 35.0132C44.4279 36.541 43.548 39.2492 44.3512 41.7214L49.8051 58.5066L35.5267 48.1327C33.4238 46.6049 30.5762 46.6049 28.4733 48.1327L14.1949 58.5066L19.6488 41.7214C20.452 39.2492 19.5721 36.541 17.4691 35.0132L3.19079 24.6393L20.8398 24.6393C23.4392 24.6393 25.7429 22.9656 26.5462 20.4934L32 3.7082Z" stroke="#4A3AFF" stroke-width="6"/>
                  </svg>
                  ` : `
                  <svg width="calc((1vw + 1vw) * .65)" height="calc((1vw + 1vw) * .65)" viewBox="0 0 64 62" fill="none" xmlns="http://www.w3.org/2000/svg" id='Star'>
                    <path d="M32 3.7082L37.4538 20.4934C38.2571 22.9656 40.5608 24.6393 43.1602 24.6393H60.8092L46.5308 35.0132C44.4279 36.541 43.548 39.2492 44.3512 41.7214L49.8051 58.5066L35.5267 48.1327C33.4238 46.6049 30.5762 46.6049 28.4733 48.1327L14.1949 58.5066L19.6488 41.7214C20.452 39.2492 19.5721 36.541 17.4691 35.0132L3.19079 24.6393L20.8398 24.6393C23.4392 24.6393 25.7429 22.9656 26.5462 20.4934L32 3.7082Z" stroke="#fff" stroke-width="6"/>
                  </svg>
                  `}
                </button>
                <button class='today__notification__panel__archive'>
                  <img src='/static/media/icons/email_archive.svg' alt='to_archive'/>
                  <span>Archive</span>
                </button>
                <button class='today__notification__panel__in_span'>
                  <img src='/static/media/icons/email_In_span.svg' alt='in_span'/>
                  <span>In span</span>
                </button>
                <button class='today__notification__panel__delete'>
                  <img src='/static/media/icons/email_trash.svg' alt='Delete'/>
                  <span>Delete</span>
                </button>
                <span class='today__notification__panel__line'></span>
                <button class='today__notification__panel__unread'>
                  <img src='/static/media/icons/email_wait.svg' alt='Unread'/>
                  <span>Unread</span>
                </button>
                <button class='today__notification__panel_add_to_tasks'>
                  <img src='/static/media/icons/email_add_todo.svg' alt='Add to tasks'/>
                  <span>Add to tasks</span>
                </button>
              </div>
            ` :  ''}
            ${type  == 'Google_Todo' || type == 'Google_Event' ? 
            `<form class='change_message_title' method='POST'>
              <input type="hidden" name="csrfmiddlewaretoken" value="${csrfToken}">
              <input type='text' value='${notification.querySelector(".notification__text").innerHTML}' name='title' placeholder='Введите заголовок' />
              <button class='btn'>Save</button>
            </form>` : 
            `<h2>${notification.querySelector(".notification__text").innerHTML}</h2>` }
            <p>${content != 'null' ? content : ''}</p>
            <div>
                <b>${notification.querySelector('.notification__title').innerHTML}</b> 
                <b>${notification.querySelector('.notification__time').innerHTML}</b>
            </div>
          `;

          if (type == 'Google_Todo' || type == 'Google_Event' ) {
            document.querySelector('.change_message_title').addEventListener('submit', (e) => {
              e.preventDefault();
        
              let formData = new FormData(document.querySelector('.change_message_title'));
              let path

              if (type == 'Google_Todo') {
                path = `/api/google-todo/${notification.querySelector('.socialGoogleTokenID').value}/lists/${notification.querySelector('.list_id').value}/tasks/${notification.querySelector('.notification_id').value}`      
              } else if (type == 'Google_Event') {
                path = `/api/google-event/${notification.querySelector('.socialGoogleTokenID').value}/${notification.querySelector('.calendar_id').value}/${notification.querySelector('.notification_id').value}`      
              }

              if (path) {
                fetch(path, {
                  method: 'POST',
                  body: formData,
                })
                  .then(response => response.json())
                  .then(data => {})
                  .catch(error => {
                    console.log('Ошибка: ', error);
                  });
              }
              
              let ntf = inbox__messages.querySelector(`#id${notification.querySelector('.notification_id').value}`);
              ntf.querySelector('.notification__text').innerHTML = formData.get('title');
            });
          } 

          const handleNotificationAction = (action, endpoint) => {
            let path = `/api/google-gmail/${notification.querySelector('.socialGoogleTokenID').value}/${notification.querySelector('.notification_id').value}/${endpoint}`

            fetch(path, {
              method: action === 'DELETE' ? 'DELETE' : 'POST',
            })
              .then(response => response.json())
              .then(data => {
                  getMessages();

                  if (endpoint === 'spam' || endpoint === 'trash') {
                    today__work.innerHTML = '';
                    notification.style.display = 'none';
                  }
                })
              .catch(error => {
                  console.log(`Ошибка при ${action}:`, error);
                });
          }

          // Работа с Gmail письмом
          if (type == 'Gmail') {
            // Архивирование
            document.querySelector('.today__notification__panel__archive').addEventListener('click', () => {
                handleNotificationAction('POST','archive')
            })

            // Добавление в Спам
            document.querySelector('.today__notification__panel__in_span').addEventListener('click', () => {
              handleNotificationAction('POST','spam')
            })

            // Удаление ( перемещение в корзину )
            document.querySelector('.today__notification__panel__delete').addEventListener('click', () => {
              handleNotificationAction('POST','trash')
            })

            // Изменение письму статус на не прочитаное
            document.querySelector('.today__notification__panel__unread').addEventListener('click', () => {
              handleNotificationAction('POST','unread')
            })

            document.querySelector('.today__notification__panel_add_to_tasks').addEventListener('click', () => {
              let note_checkbox = document.querySelector('.inbox__backlog__note__todo')
              note_checkbox.checked = true
              addStyles(note_checkbox, 1, '0 0 5px 1px RGBa(47, 0, 234, 0.46)', 'RGBa(47, 0, 234, 0.46)')

              let notes__form = document.querySelector('.inbox__backlog__notes__form')
              notes__form.querySelector('input').value  = notification.querySelector(".notification__text").innerHTML 
            })

            // Отметка письма ( звездочка )
            document.querySelector('.today__notification__panel__start').addEventListener('click', () => {
              fetch(`/api/google-gmail/${notification.querySelector('.socialGoogleTokenID').value}/${notification.querySelector('.notification_id').value}/star/${notification.querySelector('.gmail_is_liked').value}`, {
                method: 'POST',
              })
                .then(response => response.json())
                .then(data => {
                  getMessages()
                  // console.log('Отметка письма ( звездочка )', data)
                  let star__button = document.querySelector('.today__notification__panel__start')
                  // console.log(star__button)

                  if (star__button.id == 'Unstar') {
                    star__button.id = 'Star'
                    star__button.innerHTML = `
                      <svg width="calc((1vw + 1vw) * .65)" height="calc((1vw + 1vw) * .65)" viewBox="0 0 64 62" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M32 3.7082L37.4538 20.4934C38.2571 22.9656 40.5608 24.6393 43.1602 24.6393H60.8092L46.5308 35.0132C44.4279 36.541 43.548 39.2492 44.3512 41.7214L49.8051 58.5066L35.5267 48.1327C33.4238 46.6049 30.5762 46.6049 28.4733 48.1327L14.1949 58.5066L19.6488 41.7214C20.452 39.2492 19.5721 36.541 17.4691 35.0132L3.19079 24.6393L20.8398 24.6393C23.4392 24.6393 25.7429 22.9656 26.5462 20.4934L32 3.7082Z" stroke="#fff" stroke-width="6"/>
                      </svg>
                    `
                  } else {
                    star__button.id = 'Unstar'
                    star__button.innerHTML = `
                      <svg width="calc((1vw + 1vw) * .65)" height="calc((1vw + 1vw) * .65)" viewBox="0 0 64 62" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M32 3.7082L37.4538 20.4934C38.2571 22.9656 40.5608 24.6393 43.1602 24.6393H60.8092L46.5308 35.0132C44.4279 36.541 43.548 39.2492 44.3512 41.7214L49.8051 58.5066L35.5267 48.1327C33.4238 46.6049 30.5762 46.6049 28.4733 48.1327L14.1949 58.5066L19.6488 41.7214C20.452 39.2492 19.5721 36.541 17.4691 35.0132L3.19079 24.6393L20.8398 24.6393C23.4392 24.6393 25.7429 22.9656 26.5462 20.4934L32 3.7082Z" stroke="#4A3AFF" stroke-width="6"/>
                      </svg>
                    `
                  }
                })  
                .catch(error => {
                  console.log('Ошибка: ', error);
                });
            })
          }
      }

      // Обработчик для завершения Google Todo
      if (e.target.classList.contains('google_todo_accomplished')) {
        let notification = e.target.parentNode.parentNode;
        
        if (notification.style.opacity == '0.3') {
          fetch(`/api/google-todo/${notification.querySelector('.socialGoogleTokenID').value}/lists/${notification.querySelector('.list_id').value}/tasks/${notification.querySelector('.notification_id').value}/complete`, {
            method: 'POST',
            body: JSON.stringify({status: 'needsAction'}),
          })
            .then(response => response.json())
            .then(data => {
              getMessages()
              notification.style.opacity = '1';
              // console.log("Обработчик для завершения Google Todo", data)
            })
            .catch(error => {
              console.log('Ошибка: ', error);
            });

        } else {
          fetch(`/api/google-todo/${notification.querySelector('.socialGoogleTokenID').value}/lists/${notification.querySelector('.list_id').value}/tasks/${notification.querySelector('.notification_id').value}/complete`, {
            method: 'POST',
            body: JSON.stringify({status: 'completed'}),
          })
            .then(response => response.json())
            .then(data => {
              getMessages()
              notification.style.opacity = '.3';
              // console.log("Обработчик для отмены завершения Google Todo", data)
            })
            .catch(error => {
              console.log('Ошибка: ', error);
            });
        }
      }

      // Обработчик для удаления сообщения
      if (e.target.classList.contains('google_todo_delete')) {
        let notification = e.target.parentNode.parentNode;
        let type = notification.querySelector('.notification__type').value;
        let path
        console.log(notification)

        switch (type) {
          case 'Google_Todo':
            path = `/api/google-todo/${notification.querySelector('.socialGoogleTokenID').value}/lists/${notification.querySelector('.list_id').value}/tasks/${notification.querySelector('.notification_id').value}`
            break;
          case 'Gmail':
            path = `/api/google-gmail/${notification.querySelector('.socialGoogleTokenID').value}/${notification.querySelector('.notification_id').value}`            
            break;
          case 'Google_Event':
            path = `/api/google-event/${notification.querySelector('.socialGoogleTokenID').value}/${notification.querySelector('.calendar_id').value}/${notification.querySelector('.notification_id').value}`
            break;
          case 'Microsoft_Todo':
            path = `/api/microsoft-todo/${notification.querySelector('.socialGoogleTokenID').value}/lists/${notification.querySelector('.list_id').value}/tasks/${notification.querySelector('.notification_id').value}`
            break;
          case 'Microsoft_Mails':
            path = `/api/microsoft-email/${notification.querySelector('.socialGoogleTokenID').value}/${notification.querySelector('.notification_id').value}`
            break;
          case 'Microsoft_Calendar':
            path = `/api/microsoft-event/${notification.querySelector('.socialGoogleTokenID').value}/list/${notification.querySelector('.list_id').value}/tasks/${notification.querySelector('.notification_id').value}`
            break;
          default:
            break;
        }

        if (path) {
          fetch(path, {
            method: 'DELETE',
          })
            .then(response => response.json())
            .then(data => {
              getMessages()
              notification.style.display = 'none';
              console.log(data)
            })  
            .catch(error => {
              console.log('Ошибка: ', error);
            });  
        }
      }

      // Обработчик для ответа на письма
      document.querySelectorAll('.notification__answer__on__gmail').forEach(elem => {
        elem.addEventListener('submit', (e) => {
          e.preventDefault();
        
          let form = e.target;
          let formData = new FormData(form);
    
          formData.append('csrfmiddlewaretoken', csrfToken);
        
          let notification = form.parentNode;

          // Отправляем ответ на Gmail письмо
          fetch(`/api/google-gmail/${notification.querySelector('.socialGoogleTokenID').value}/${notification.querySelector('.notification_id').value}`, {
            method: 'POST',
            body: formData
          })
            .then(response => response.json())
            .then(data => {
              // console.log(data);
              // console.log("Отправляем ответ на Gmail письмо", data)
            })  
            .catch(error => {
              console.log('Ошибка: ', error);
            });
      })
    });
  }) 

  // Добавляем обработчики событий для чекбоксов в настройках
  inboxSettingsForm.querySelectorAll('.check__input').forEach(input => {
    input.addEventListener('click', () => {
      if (input.checked) {
        if (!social_medias.includes(input.value)) {
          social_medias.push(input.value);
        }
      } else {
        const index = social_medias.indexOf(input.value);
        if (index !== -1) {
          social_medias.splice(index, 1);
        }
      }

      getMessages();
    })
  })

    // Вызываем функцию для получения сообщений
    getMessages()

    setInterval(() => {
        console.log('1 секунда');
        loadSeconds+= 1
    }, 1000);
// })
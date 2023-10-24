document.addEventListener('DOMContentLoaded', () => {
  // Получаем ссылку на форму настроек почтового ящика
  let inboxSettingsForm = document.querySelector('#inboxSettingsForm');
  // Получаем CSRF-токен из атрибута элемента
  let csrfToken = document.getElementById('csrf-token').getAttribute('data-csrf-token');
  // Получаем список сообщений
  let messages_list = document.getElementById('messages-list'); 
  // Получаем контейнер для иконок социальных сетей
  let inbox_icons = document.querySelector('#inbox-icons');
  // Получаем контейнер для сегодняшних задач
  let today__work = document.querySelector('.today__work');

  // Массив социальных сетей
  const social_medias = ['Gmail', 'Google_Todo', 'Google_Event', 'YouTube'];

  // Получаем контейнер для сообщений в почтовом ящике
  let inbox__messages = document.querySelector('.inbox__messages');

  // Функция для удаления класса "inbox-show" у всех кнопок категорий
  const RemoveInboxShow = (icons) => {
    for (const icon of icons) {
      icon.classList.remove('inbox-show');
    }
  }

  const renderMessage = (message, messages_list) => {
    const div = document.createElement('div');
    div.classList.add('notification');
    div.id = `id${message.id}`;

    if (message.status == 'completed') {
      div.style.opacity = '.3';
    }

    div.innerHTML = `
      <h2 class="notification__title">${message.sender}</h2>
      <div class="notification__text"> ${message.title}</div>

      ${message.type == 'Gmail' ? `
      <form method='POST' class='notification__answer__on__gmail'>
        <input type="hidden" name="csrfmiddlewaretoken" value="${csrfToken}">
        <input type="text" name='message' placeholder='Answer...' />
        <button class='notification__answer__on__gmail__button' type='submit'>
          <i class="fa-regular fa-paper-plane"></i>
        </button>
      </form>
      ` : ''}
    
      <div class="notification__buttons">
        <a href="${message.link}" target='_blank'>show</a>
        ${message.type == 'Gmail' || message.type == 'Google_Todo' || message.type == 'Google_Event' ? "<a class='google_todo_delete'>del</a>" : ''}
        ${message.type == 'Google_Todo' ? "<a class='google_todo_accomplished'>comp</a>" : ''}
      </div>

      <span class='notification__time'>${message.created_time}</span>

      <div class="notification__content">${message.text}</div>
      <input type='hidden' class='notification_id' value='${message.id}' />
      <input type='hidden' class='socialGoogleTokenID' value='${message.social_google_token_id}' />
      
      <input type='hidden' class='notification__type' value='${message.type}' />
      ${message.list_id ? `<input type='hidden' class='list_id' value='${message.list_id}' />` : ''}
      ${message.calendar_id ? `<input type='hidden' class='calendar_id' value='${message.calendar_id}' />` : ''}
      ${message.type == 'Gmail' ? `<input type='hidden' class='gmail_is_liked' value='${message.is_liked}' />`: ''}
    `;

    messages_list.appendChild(div);
  }

  const renderButton = (type, inbox_icons) => {
    // Добавляем кнопки для отображения сообщений социальных сетей
    inbox_icons.innerHTML += `
      <button class='icon' id='${type}'>
        <img src="/static/media/icons/${type}.svg" alt="${type}">
      </button>
    `;
  }

  const renderData = (messages, messages_list) => {
    messages_list.innerHTML = ''

    messages.forEach(message => {
      renderMessage(message, messages_list)
    })
  }

  // Функция для сравнения объектов по полю created
  function compareByCreated(a, b) {
    const dateA = new Date(a.created_time);
    const dateB = new Date(b.created_time);
    
    if (dateA > dateB) {
      return -1;
    }
    if (dateA < dateB) {
      return 1;
    }
    return 0;
  }

  // Fetch Gmail Data
  const fetchGmailData = async () => {
    console.log('Fetching Gmail data')
    const response = await fetch('/api/messages/gmail')
    const data = await response.json()
    return data
  };
  
  // Fetch Google Calendar
  const fetchGoogleCalendarData = async () => {
    console.log('Fetching Callendar data')
    const response = await fetch('/api/messages/google-calendar')
    const data = await response.json()
    return data
  };

  // Fetch Google Todo
  const fetchGoogleTodoData = async () => {
    console.log('Fetching Google Todo data')
    const response = await fetch('/api/messages/google-todo')
    const data = await response.json()
    return data
  };

  // Fetch YouTube
  const fetchYouTubeData = async () => {
    console.log('Fetching YouTube data')
    const response = await fetch('/api/messages/youtube')
    const data = await response.json()
    return data
  };

  // Fetch GitHub
  const fetchGitHubNotifications = async () => {
    console.log('Fetching GitHub notifications')
    const response = await fetch('/api/messages/github')
    const data = await response.json()
    return data
  };

  // Fetch Facebook
  const fetchFacebookNotifications = async () => {
    console.log('Fetching Facebook notifications')
    const response = await fetch('/api/messages/facebook')
    const data = await response.json()
    return data
  };
  
  // Fetch Microsoft Todos
  const fetchMicrosoftTodosData= async () => {
    console.log('Fetching Microsoft Todos')
    const response = await fetch('/api/messages/microsoft-todo')
    const data = await response.json()
    console.log('\n\n\n Microsoft Data fetched successfully \n\n\n', data)
    return data
  };

  // Fetch Microsoft Mails
  const fetchMicrosoftMailsData= async () => {
    console.log('Fetching Microsoft Todos')
    const response = await fetch('/api/messages/microsoft-mails')
    const data = await response.json()
    console.log('\n\n\n Microsoft Data fetched successfully \n\n\n', data)
    return data
  };
  
  // Show Messages
  const ShowMessages = async () => {
    var all_messages = []
    let errors = []
    
    const [
            calendarData, 
            todoData, 
            gmailData, 
            youtubeData,
            githubData,
            microsoftTodosData,
            microsoftMailsData,
      ] = await Promise.all([
      fetchGoogleCalendarData(),
      fetchGoogleTodoData(),
      fetchGmailData(),
      fetchYouTubeData(),
      fetchGitHubNotifications(),
      fetchMicrosoftTodosData(),
      fetchMicrosoftMailsData(),
    ]);  

    messages_list.innerHTML = inbox_icons.innerHTML = ''

    inbox_icons.innerHTML += `
      <button class='icon' id='show_all_messages'>
        <span class="material-symbols-outlined">
          mark_chat_unread
        </span>
      </button>`

   
    const displayMessages = (data) => {
      console.log(data)
      if (data.status == 'success') {
        renderButton(data.type,  inbox_icons)
        all_messages = all_messages.concat(data.data)
      } else {
        errors = errors.concat({'status': data.status, 'message': data.message})
      }
    }

    displayMessages(gmailData),
    displayMessages(calendarData),
    displayMessages(todoData),
    displayMessages(youtubeData),
    displayMessages(githubData),
    displayMessages(microsoftTodosData)
    displayMessages(microsoftMailsData)
    
    console.log(errors)

    const icons = document.querySelectorAll('.icon');


    const MessagesColumnChecking = (type, icon) => {
      icon.classList.add('inbox-show');

      if (type == 'Gmail') {  
        renderData(gmailData.data, messages_list)
        localStorage.setItem('inbox-show', type)
      } else if (type == 'Google_Event') {
        renderData(calendarData.data, messages_list)
        localStorage.setItem('inbox-show', type)
      } else if (type == 'Google_Todo') {
        renderData(todoData.data, messages_list)
        localStorage.setItem('inbox-show', 'Google_Todo')
      } else if (type == 'YouTube') {
        renderData(youtubeData.data, messages_list)
        localStorage.setItem('inbox-show', 'YouTube')
      } else if (type == 'GitHub') {
        renderData(githubData.data, messages_list)
        localStorage.setItem('inbox-show', 'GitHub')
      } else {
        all_messages.sort(compareByCreated) 
        renderData(all_messages, messages_list)
        localStorage.setItem('inbox-show', type)
      }
    }

    if (errors.length < 4) {

      let type_from_localStorage = localStorage.getItem('inbox-show');

      if (type_from_localStorage) {
        MessagesColumnChecking(
          type_from_localStorage, 
          document.getElementById(type_from_localStorage)
        );
      } else {
        renderData(all_messages, messages_list);
      }

       // Добавляем обработчики событий для кнопок категорий
      for (const icon of icons) {
        icon.addEventListener('click', () => {
          RemoveInboxShow(icons);
          MessagesColumnChecking(icon.id, icon)
        });
      }

    } else {
      messages_list.innerHTML = `<div class='inbox__messages__error'>
        ${errors[0].message}, please re-login or when requesting access to social networks, mark what you would like to show.
      </div>`
    }
  }

  // Добавляем обработчики событий для кнопок в списке сообщений
  messages_list.addEventListener('click', (e) => {
      if (e.target.classList.contains('notification__text')) {
          let notification  = e.target.parentNode;

          let type = notification.querySelector('.notification__type').value;
          let content = notification.querySelector('.notification__content').innerHTML;

          console.log(notification)
          today__work.innerHTML = `
            ${type == 'Gmail' ? `
              <div class='today__notification__panel'>
                <button class='today__notification__panel__start'>
                  ${notification.querySelector('.gmail_is_liked').value == 'true' ? `
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

              // Обновляем Google Todo
              if (type == 'Google_Todo') {
                fetch(`/api/patch-title-todo/${notification.querySelector('.socialGoogleTokenID').value}/${notification.querySelector('.list_id').value}/${notification.querySelector('.notification_id').value}`, {
                  method: 'POST',
                  body: formData,
                })
                  .then(response => response.json())
                  .then(data => {})
                  .catch(error => {
                    console.log('Ошибка: ', error);
                  });
              // Обновляем Google Event
              } else if (type == 'Google_Event') {
                fetch(`/api/google-event/${notification.querySelector('.socialGoogleTokenID').value}/${notification.querySelector('.calendar_id').value}/${notification.querySelector('.notification_id').value}`, {
                  method: 'POST',
                  body: formData,
                })
                  .then(response => response.json())
                  .then(data => {
                    console.log(data);
                  })
                  .catch(error => {
                    console.log('Ошибка: ', error);
                  });
              }

              let ntf = inbox__messages.querySelector(`#id${notification.querySelector('.notification_id').value}`);
              ntf.querySelector('.notification__text').innerHTML = formData.get('title');
            });
          } 

          // Работа с Gmail письмом
          if (type == 'Gmail') {
            // Архивирование
            document.querySelector('.today__notification__panel__archive').addEventListener('click', () => {
              fetch(`/api/google-gmail/${notification.querySelector('.socialGoogleTokenID').value}/${notification.querySelector('.notification_id').value}/archive`, {
                method: 'POST',
              })
                .then(response => response.json())
                .then(data => {
                  ShowMessages()
                  console.log(data);
                })
                .catch(error => {
                  console.log('Ошибка: ', error);
                });
            })

            // Добавление в Спам
            document.querySelector('.today__notification__panel__in_span').addEventListener('click', () => {
              fetch(`/api/google-gmail/${notification.querySelector('.socialGoogleTokenID').value}/${notification.querySelector('.notification_id').value}/spam`, {
                method: 'POST',
              })
                .then(response => response.json())
                .then(data => {
                  ShowMessages()
                  today__work.innerHTML = ''
                  notification.style.display = 'none'
                  console.log(data)
                })
                .catch(error => {
                  console.log('Ошибка: ', error);
                });
            })

            // Удаление ( перемещение в корзину )
            document.querySelector('.today__notification__panel__delete').addEventListener('click', () => {
              fetch(`/api/google-gmail/${notification.querySelector('.socialGoogleTokenID').value}/${notification.querySelector('.notification_id').value}`, {
                method: 'DELETE',
              })
                .then(response => response.json())
                .then(data => {
                  ShowMessages()
                  today__work.innerHTML = ''
                  notification.style.display = 'none'
                })  
                .catch(error => {
                  console.log('Ошибка: ', error);
                });
            })

            // Изменение письму статус на не прочитаное
            document.querySelector('.today__notification__panel__unread').addEventListener('click', () => {
              fetch(`/api/google-gmail/${notification.querySelector('.socialGoogleTokenID').value}/${notification.querySelector('.notification_id').value}/unread`, {
                method: 'POST',
              })
                .then(response => response.json())
                .then(data => {
                  console.log(data);
                })  
                .catch(error => {
                  console.log('Ошибка: ', error);
                });
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
                  ShowMessages()
                  console.log(data)
                  let star__button = document.querySelector('.today__notification__panel__start')
                  console.log(star__button)

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
          fetch(`/api/сomplete-todo/${notification.querySelector('.socialGoogleTokenID').value}/${notification.querySelector('.list_id').value}/${notification.querySelector('.notification_id').value}`, {
            method: 'POST',
            body: JSON.stringify({status: 'needsAction'}),
          })
            .then(response => response.json())
            .then(data => {
              ShowMessages()
              notification.style.opacity = '1';
            })
            .catch(error => {
              console.log('Ошибка: ', error);
            });

        } else {
          fetch(`/api/сomplete-todo/${notification.querySelector('.socialGoogleTokenID').value}/${notification.querySelector('.list_id').value}/${notification.querySelector('.notification_id').value}`, {
            method: 'POST',
            body: JSON.stringify({status: 'completed'}),
          })
            .then(response => response.json())
            .then(data => {
              ShowMessages()
              notification.style.opacity = '.3';
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
        
        // Удаляем Google Todo
        if (type == 'Google_Todo') {
          fetch(`/api/delete-todo/${notification.querySelector('.socialGoogleTokenID').value}/${notification.querySelector('.list_id').value}/${notification.querySelector('.notification_id').value}`, {
            method: 'DELETE',
          })
            .then(response => response.json())
            .then(data => {
              ShowMessages()
              notification.style.display = 'none';
            })  
            .catch(error => {
              console.log('Ошибка: ', error);
            });
        } else if (type == 'Gmail') {

        // Удаляем письмо Gmail
          fetch(`/api/google-gmail/${notification.querySelector('.socialGoogleTokenID').value}/${notification.querySelector('.notification_id').value}`, {
            method: 'DELETE',
          })
            .then(response => response.json())
            .then(data => {
              ShowMessages()
              console.log(data)
              notification.style.display = 'none';
            })  
            .catch(error => {
              console.log('Ошибка: ', error);
            });
        } else if (type == 'Google_Event') {

          // Удаляем событие Google Event
          fetch(`/api/google-event/${notification.querySelector('.socialGoogleTokenID').value}/${notification.querySelector('.calendar_id').value}/${notification.querySelector('.notification_id').value}`, {
            method: 'DELETE',
          })
            .then(response => response.json())
            .then(data => {
              ShowMessages()
              notification.style.display = 'none';
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
              console.log(data);
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
  
      ShowMessages();
    })
  })


  ShowMessages()

  setInterval(() => {
    ShowMessages();
  }, 10000); // 60000 == 1 минута

  // выводим  1 секунду
  setInterval(() => {
      console.log('1 секунда');
  }, 1000);
})
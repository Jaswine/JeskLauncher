document.addEventListener('DOMContentLoaded', () => {
    let messages_list = document.getElementById('messages-list'); 
    let inbox_icons = document.querySelector('#inbox-icons');

    // TODO: WITHOUT Async - 7s
    // TODO: WITH Async  - 9s

    const showMessages = async () => {
        try {
            const response = await fetch('/api/messages');
            const data = await response.json();
        
            messages_list.innerHTML = ''
            inbox_icons.innerHTML = ''
        
            if (data.status === 'success') {
              // ! add  category buttons 
              // ? show all messages button ?
              inbox_icons.innerHTML += `
                <button class='icon' id='show_all_messages'>
                  <span class="material-symbols-outlined">
                    mark_chat_unread
                  </span>
                </button>
              `

              // ? show other social medias ?
              data.included_apps.forEach((app) => {
                inbox_icons.innerHTML += `
                  <button class='icon' id='${app}'>
                    <img src="/static/media/icons/${app}.svg" alt="${app}">
                  </button>
                  `
              })

              const icons = document.querySelectorAll('.icon')

              // ? Remove .inbox-show from all categories ?
              const RemoveInboxShow = () => {
                for (const icon of icons) {
                  icon.classList.remove('inbox-show')
                }
              }

              // ? render message ?
              const renderMessage = (message, messages_list) => {
                const div = document.createElement('div')
                div.classList.add('notification')
                div.id = `${message.id}`

                div.innerHTML = `
                 <h2 class="notification__title">${message.sender}</h2>
                 <div class="notification__text"> ${message.title}</div>
                 <div class="notification__buttons"><a href="${message.link}" target='_blank'>show</a></div>
                 <span class='notification__time'>
                 ${message.created_time}
                 </span>
                `;

                messages_list.appendChild(div)
              }

              // ? get messages from api ?
              const getMessages = (data) => {
                messages_list.innerHTML = ''

                data.forEach(message => {
                  renderMessage(message, messages_list)
                });
              }

              // * Add onclick event for category buttons *
              for (const icon of icons) {
                icon.addEventListener('click', () => {
                  RemoveInboxShow()
                  icon.classList.add('inbox-show')

                  if (icon.id == 'show_all_messages') {
                    getMessages(data.all_messages)
                  } else {  
                    getMessages(data.services[icon.id])
                  }

                  localStorage.setItem('now_list', icon.id)

                })
              }
          
              // show initial messages
              let now_list = localStorage.getItem('now_list')

              if (now_list) {
                if (now_list == 'show_all_messages') {
                  document.querySelector('#show_all_messages').classList.add('inbox-show')
                  getMessages(data.all_messages)
                } else {
                  document.querySelector(`#${now_list}`).classList.add('inbox-show')
                  getMessages(data.services[now_list])
                }
              } else {
                document.querySelector('#show_all_messages').classList.add('inbox-show')

                getMessages(data.services[now_list])
              }

            } else {
              messages_list.innerHTML = `<h3>${data.message}</h3>`;
            }
          } catch (error) {
            console.error('Error: ', error);
          }
    }

    messages_list.addEventListener('click', (e) => {
        if (e.target.classList.contains('notification__title')) {
            let id = e.target.id
            let notification_message = e.target.parentNode
            let notification = e.target.parentNode.parentNode.parentNode

            let type = notification.querySelector('.notification__type').innerHTML

            let notification__todo_id = e.target.parentNode.parentNode.querySelector('.notification__todo_id')

            let nId = nListId =''

            if (notification__todo_id) {
              nId = notification__todo_id.value
            }

            if (type == 'Google Todo') {
              let notification__todo_list = e.target.parentNode.parentNode.querySelector('.notification__todo_list')

              if (notification__todo_list) {
                nListId = notification__todo_list.value
              }
            }

            today__work.innerHTML = `
                ${ type == 'Google Todo' ? `
                  <form method='POST' class='change_message_title'>
                    <input type='text' value='${e.target.textContent}' name='title' />
                    <button class='btn'>save</button>
                  </form> 
                  ` : `<h2>${e.target.textContent} </h2>`}
                <p>${notification_message.querySelector('.notification__text').innerHTML}</p>
                <p>
                    <b>${notification_message.querySelector('.notification__sender').innerHTML}</b> - 
                    <b>${notification_message.querySelector('.notification__message__time').innerHTML}</b>
                </p>  
                <input type='hidden' id='today_work_id' value='${nId}'/>
                ${nListId? `<input type='hidden' id='today_work_class_list' value='${nListId}'/>` : ''}
            `

            if (type == 'Google Todo') {
              document.querySelector('.change_message_title').addEventListener('submit', (e) => {
                e.preventDefault()
                let parent = e.target.parentNode
                console.log(parent)
          
                let formData = new FormData(document.querySelector('.change_message_title'))
                console.log(formData)
          
                fetch(`/api/patch-title-todo/${notification.querySelector('.notification__todo_list').value}/${notification.id}`, {
                  method: 'POST',
                  body: formData,
                })
                  .then(response => response.json())
                  .then(data => {
                    console.log(data)
                  })
                  .catch(error => {
                    console.log('Error: ', error)
                  })

                let title = messages_list.querySelector(`.${nId}_title`)
                title.innerHTML = formData.get('title')
              })
            }
        }

        // TODO: accomplished
        if (e.target.classList.contains('google_todo_accomplished')) {
          let parent = e.target.parentNode
          let notification = parent.parentNode.parentNode

          id = notification.id

          if (notification.style.opacity == '0.3') {
            fetch(`/api/сomplete-todo/${notification.querySelector('.notification__todo_list').value}/${notification.id}`, {
              method: 'POST',
              body: JSON.stringify({status: 'needsAction'}),
            })
              .then(response => response.json())
              .then(data => {
                console.log(data)
                notification.style.opacity = '1'
              })
              .catch(error => {
                console.log('Error: ', error)
              })

          } else {
            fetch(`/api/сomplete-todo/${notification.querySelector('.notification__todo_list').value}/${notification.id}`, {
              method: 'POST',
              body: JSON.stringify({status: 'completed'}),
            })
              .then(response => response.json())
              .then(data => {
                console.log(data)
                notification.style.opacity = '.3'
              })
              .catch(error => {
                console.log('Error: ', error)
              })
          }
        }

        // TODO: delete
        if (e.target.classList.contains('google_todo_delete')) {
          let parent = e.target.parentNode
          let notification = parent.parentNode.parentNode

          let type = notification.querySelector('.notification__type').innerHTML
          
          // ! ___________ DELETE GOOGLE TODO ___________
          if (type == 'Google Todo') {
            fetch(`/api/delete-todo/${notification.querySelector('.notification__todo_list').value}/${notification.id}`, {
              method: 'DELETE',
            })
              .then(response => response.json())
              .then(data => {
                notification.style.display = 'none'
              })  
              .catch(error => {
                console.log('Error: ', error)
              })
          } else if (type == 'Gmail') {
          // ! ___________ DELETE GMAIL LETTERS ___________
            fetch(`/api/delete-email/${notification.id}`, {
              method: 'DELETE',
            })
              .then(response => response.json())
              .then(data => {
                console.log(data)
                notification.style.display = 'none'
              })  
              .catch(error => {
                console.log('Error: ', error)
              })
          }
        }
    }) 
    showMessages()

    setInterval(() => {
        showMessages()
    }, 10000) // 60000 == 1 minute

    setInterval(() => {
        console.log('1sec')
    }, 1000)
})
document.addEventListener('DOMContentLoaded', () => {
  let inboxSettingsForm = document.querySelector('#inboxSettingsForm')
  let csrfToken = document.getElementById('csrf-token').getAttribute('data-csrf-token');
  let messages_list = document.getElementById('messages-list'); 
  let inbox_icons = document.querySelector('#inbox-icons');
  let today__work = document.querySelector('.today__work');

  const social_medias = ['Gmail', 'Google_Todo', 'Google_Event', 'YouTube']

  let inbox__messages = document.querySelector('.inbox__messages')

  // TODO: WITHOUT Async - 7s
  // TODO: WITH Async  - 9s

  const showMessages = async () => {
      try {
          const response = await fetch(`/api/messages?filter=${social_medias}`);
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
              div.id = `id${message.id}`

              if (message.status == 'completed') {
                div.style.opacity = '.3'
              }

              div.innerHTML = `
                <h2 class="notification__title">${message.sender}</h2>
                <div class="notification__text"> ${message.title}</div>

                ${message.type == 'Gmail' ? `
                <form method='POST' class='notification__answer__on__gmail'>
                  <input type="hidden" name="csrfmiddlewaretoken" value="6I82Yjvf9MUCF2JpH3TWUOuU8BQQPReGPwLnE2Xqn7QZVo9KgViprwl5msfKlzo3">
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
                <input type='hidden' class='notification__type' value='${message.type}' />
                ${message.list_id ? `<input type='hidden' class='list_id' value='${message.list_id}' />` : ''}
                ${message.calendar_id ? `<input type='hidden' class='calendar_id' value='${message.calendar_id}' />` : ''}
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

              getMessages(data.all_messages)
            }

          } else {
            messages_list.innerHTML = `<h3>${data.message}</h3>`;
          }
        } catch (error) {
          console.error('Error: ', error);
        }
  }

  // TODO: Buttons 
  messages_list.addEventListener('click', (e) => {
      if (e.target.classList.contains('notification__text')) {
          let notification  = e.target.parentNode

          let type = notification.querySelector('.notification__type').value
          let content = notification.querySelector('.notification__content').innerHTML

          today__work.innerHTML = `
            ${type  == 'Google_Todo' || type == 'Google_Event' ? 
            `<form class='change_message_title' method='POST'>
              <input type="hidden" name="csrfmiddlewaretoken" value="6I82Yjvf9MUCF2JpH3TWUOuU8BQQPReGPwLnE2Xqn7QZVo9KgViprwl5msfKlzo3">
              <input type='text' value='${notification.querySelector(".notification__text").innerHTML}' name='title' placeholder='Enter title' />
              <button class='btn'>save</button>
            </form>` : 
            `<h2>${notification.querySelector(".notification__text").innerHTML}</h2>` }
            <p>${content != 'null' ? content : ''}</p>
            <div>
                <b>${notification.querySelector('.notification__title').innerHTML}</b> 
                <b>${notification.querySelector('.notification__time').innerHTML}</b>
            </div>
          `

          if (type == 'Google_Todo' || type == 'Google_Event' ) {
            document.querySelector('.change_message_title').addEventListener('submit', (e) => {
              e.preventDefault()
        
              let formData = new FormData(document.querySelector('.change_message_title'))          

              // TODO: update google todo
              if (type == 'Google_Todo') {
                fetch(`/api/patch-title-todo/${notification.querySelector('.list_id').value}/${notification.querySelector('.notification_id').value}`, {
                  method: 'POST',
                  body: formData,
                })
                  .then(response => response.json())
                  .then(data => {})
                  .catch(error => {
                    console.log('Error: ', error)
                  })
              // TODO: update google event
              } else if (type == 'Google_Event') {
                fetch(`/api/google-event/${notification.querySelector('.calendar_id').value}/${notification.querySelector('.notification_id').value}`, {
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
              }

              let ntf = inbox__messages.querySelector(`#id${notification.querySelector('.notification_id').value}`)
              console.log(ntf)
              ntf.querySelector('.notification__text').innerHTML = formData.get('title')
            })
          }  
      }

      // TODO: accomplished
      if (e.target.classList.contains('google_todo_accomplished')) {
        let notification = e.target.parentNode.parentNode
        
        if (notification.style.opacity == '0.3') {
          fetch(`/api/сomplete-todo/${notification.querySelector('.list_id').value}/${notification.querySelector('.notification_id').value}`, {
            method: 'POST',
            body: JSON.stringify({status: 'needsAction'}),
          })
            .then(response => response.json())
            .then(data => {
              notification.style.opacity = '1'
            })
            .catch(error => {
              console.log('Error: ', error)
            })

        } else {
          fetch(`/api/сomplete-todo/${notification.querySelector('.list_id').value}/${notification.querySelector('.notification_id').value}`, {
            method: 'POST',
            body: JSON.stringify({status: 'completed'}),
          })
            .then(response => response.json())
            .then(data => {
              notification.style.opacity = '.3'
            })
            .catch(error => {
              console.log('Error: ', error)
            })
        }
      }

      // TODO: delete
      if (e.target.classList.contains('google_todo_delete')) {
        let notification = e.target.parentNode.parentNode

        let type = notification.querySelector('.notification__type').value
        
        // ! ___________ DELETE GOOGLE TODO ___________
        if (type == 'Google_Todo') {
          fetch(`/api/delete-todo/${notification.querySelector('.list_id').value}/${notification.querySelector('.notification_id').value}`, {
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
          fetch(`/api/google-gmail/${notification.querySelector('.notification_id').value}`, {
            method: 'DELETE',
          })
            .then(response => response.json())
            .then(data => {
              notification.style.display = 'none'
            })  
            .catch(error => {
              console.log('Error: ', error)
            })
        } else if (type == 'Google_Event') {

          // ! ___________ DELETE EVENT ___________
          fetch(`/api/google-event/${notification.querySelector('.calendar_id').value}/${notification.querySelector('.notification_id').value}`, {
            method: 'DELETE',
          })
            .then(response => response.json())
            .then(data => {
              console.log('Event: ', data)
              notification.style.display = 'none'
            })  
            .catch(error => {
              console.log('Error: ', error)
            })
        }
      }

        // TODO: Answer on letters
        document.querySelectorAll('.notification__answer__on__gmail').forEach(elem => {
        elem.addEventListener('submit', (e) => {
          e.preventDefault();
        
          let form = e.target;
          let formData = new FormData(form);
    
          formData.append('csrfmiddlewaretoken', '{{ csrf_token }}');
        
          let notification = form.parentNode; // Adjust this based on your HTML structure
        
          fetch(`/api/google-gmail/${notification.querySelector('.notification_id').value}`, {
            method: 'POST',
            body: formData
          })
            .then(response => response.json())
            .then(data => {
              console.log(data);
            })  
            .catch(error => {
              console.log('Error: ', error);
            });
      })
    });
  }) 

  inboxSettingsForm.addEventListener('submit', (e) => {
    e.preventDefault()

    inboxSettingsForm.querySelectorAll('.check__input').forEach(input => {
      if (input.checked) {
        if (!social_medias.includes(input.value)) {
          social_medias.push(input.value);
        }
      } else {
        const index = social_medias.indexOf(input.value);
        if (index !== -1) {
          social_medias.splice(index, 1);
        }

        // console.log(input.value)
        // let media = document.querySelector(`#${input.value}`)
        // console.log(media)
      }
    })

    console.log(social_medias)

    fetch(`/api/messages?filter=${social_medias}`)
        .then(response => response.json())
        .then(data => {
            let inboxSettings = document.querySelector('#inboxSettings')

            inboxSettings.style.opacity = '1' 
            
            setTimeout(() => {
              inboxSettings.style.display = 'none';
            }, 300)

            showMessages()
        })  
        .catch(error => {
            console.error('Error:', error);
        });
  })

  showMessages()

  setInterval(() => {
      showMessages()
  }, 30000) // 60000 == 1 minute

  setInterval(() => {
      console.log('1sec')
  }, 1000)
})
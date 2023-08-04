document.addEventListener('DOMContentLoaded', () => {
    let messages_list = document.getElementById('messages-list'); 
    let today__work = document.querySelector('.today__work')
    
    // TODO: WITHOUT Async - 7s
    // TODO: WITH Async  - 9s

    const showMessages = async () => {
        try {
            const response = await fetch('/api/messages');
            const data = await response.json();
        
            messages_list.innerHTML = '';
        
            if (data.status === 'success') {
              data.messages.forEach((message) => {
                const div = document.createElement('div');
                div.classList.add('notification');
                div.id = `${message.id}`;
                let icon_path = ''

                if (message.type === 'Gmail') {
                  icon_path = '/static/media/icons/gmail.svg'
                } else if (message.type == 'Google Todo') {
                  icon_path = '/static/media/icons/google_todo.png'
                } else if (message.type == 'YouTube') {
                  icon_path = '/static/media/icons/youtube.svg'
                } else if (message.type == 'Google Event') {
                  icon_path = '/static/media/icons/g-calendar.svg'
                }

                if (message.status == 'completed') {
                  div.style.opacity = '.3'
                }


                div.innerHTML = `
                  <div class="notification__header">
                    <img src="${icon_path}" alt="${icon_path}">
                    <span class='notification__type'>${message.type}</span>
                  </div>
                  <div class="notification__body">
                    <div class="notification__message">
                      <span class="notification__title ${message.id}_title" id='${message.id}_title'>${message.title}</span>
                      <span class="notification__message__time">${message.created_time}</span>
                      <span class="notification__text">${message.text}</span>
                      <span class = "notification__sender">${message.sender}</span>
                      </div>
                    <div class="notification__links">
                      <a href="${message.link}" target="_blank" style="color: rgb(20,20,20,.6); border: 1px solid rgb(20,20,20,.3)">Show</a>
                      ${message.type == 'Google Todo'? `<a style="color: rgb(20,20,20,.6); border: 1px solid rgb(20,20,20,.3)" class='google_todo_accomplished'>Comp</a>` : ''}
                      ${message.type == 'Google Todo' || message.type == 'Gmail' ? `<a style="color: rgb(20,20,20,.6); border: 1px solid rgb(20,20,20,.3)" class='google_todo_delete'>Del</a>` : ''}
                    </div>
                    ${message.id ? `<input type='hidden' class='notification__todo_id' value='${message.id}' />`: ""}
                    ${message.list_id ? `<input type='hidden' class='notification__todo_list' value='${message.list_id}' />`: ""}
                  </div>
                `;

                messages_list.appendChild(div)

              });
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
    }, 60000) // 60000 == 1 minute

    setInterval(() => {
        console.log('1sec')
    }, 1000)
})
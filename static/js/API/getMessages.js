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
                }

                console.log(message.status)
                if (message.status == 'completed') {
                  notification.style.opacity = '.3'
                }


                div.innerHTML = `
                  <div class="notification__header">
                    <img src="${icon_path}" alt="${icon_path}">
                    <span>${message.type}</span>
                  </div>
                  <div class="notification__body">
                    <div class="notification__message">
                      <span class="notification__title" id='${message.id}_title'>${message.title}</span>
                      <span class="notification__message__time">${message.created_time}</span>
                      <span class="notification__text">${message.text}</span>
                      <span class = "notification__sender">${message.sender}</span>
                      </div>
                    <div class="notification__links">
                      <a href="${message.link}" target="_blank" style="color: rgb(20,20,20,.6); border: 1px solid rgb(20,20,20,.3)">Show</a>
                      ${message.type == 'Google Todo'? `<a style="color: rgb(20,20,20,.6); border: 1px solid rgb(20,20,20,.3)" class='google_todo_accomplished'>Comp</a>` : ''}
                      ${message.type == 'Google Todo'? `<a style="color: rgb(20,20,20,.6); border: 1px solid rgb(20,20,20,.3)" class='google_todo_delete'>Del</a>` : ''}
                    </div>
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
            let type = e.target.parentNode.parentNode
            console.log(type)
            let notification__text = notification_message.querySelector('.notification__text')
            let notification__sender = notification_message.querySelector('.notification__sender')
            let notification__message__time = notification_message.querySelector('.notification__message__time')

            today__work.innerHTML = `
                <h2>${e.target.textContent}</h2>
                <p>${notification__text.innerHTML}</p>
                <p>
                    <b>${notification__sender.innerHTML}</b> - 
                    <b>${notification__message__time.innerHTML}</b>
                </p>
            `
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
        }
    })    

    showMessages()

    setInterval(() => {
        showMessages()
    }, 60000)

    setInterval(() => {
        console.log('1sec')
    }, 1000)
})
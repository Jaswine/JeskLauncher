//update-settings
document.addEventListener('DOMContentLoaded', () => {
    let settingsForm = document.getElementById('settingsForm')
    let messages_place = document.querySelector('.messages')

    // submit form
    settingsForm.addEventListener('submit', (e) => {
        e.preventDefault()
        let formData = new FormData(settingsForm);
        
        fetch('/api/update-settings', {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                console.log(data)

                // close settings module
                let settings = document.querySelector('.settings')

                settings.style.display = 'none'

                if (data.message) {
                    // write message 
                    const div =  document.createElement('div')
                    div.classList.add('message')

                    // check status message
                    if (data.status == 'error') {
                        div.style.backgroundColor = '#bc8f8f'
                        div.style.color = '#fff'
                        div.style.border = '1px solid #fff'
                    } else {
                        div.style.backgroundColor = 'rgb(142, 191, 254, 1)'
                    }

                    div.innerHTML = `
                        ${data.message} 
                    `
                    messages_place.appendChild(div)

                    // auto close message
                    setTimeout(() => {
                        div.style.display = 'none';
                    },  3500)   
                }
            })  
            .catch(error => {
                console.error('Error:', error);
            });
    })
})
//update-settings
document.addEventListener('DOMContentLoaded', () => {
    let settingsForm = document.getElementById('settingsForm')
    let messages_place = document.querySelector('.messages')
    let check__calendar = document.querySelector('.check__calendar')

    let calendar = document.querySelector('.calendar')
    let today = document.querySelector('.today')
    let inbox = document.querySelector('.inbox')
    let calendar__settings = document.querySelector('.calendar__settings')
    let calendar__footer = document.querySelector('.calendar__footer')

    check__calendar.checked = true
    check__calendar.addEventListener('change', () => {
        if (check__calendar.checked) {
            calendar.style.width = '25%'

            today.style.width = '50%'
            today.style.maxWidth = '50%'

            inbox.style.width = '25%'
            inbox.style.maxWidth = '25%'

            calendar__settings.classList.remove('without_calendar')
            calendar__footer.classList.remove('without_calendar')
        } else {
            calendar.style.width = '0%'

            today.style.width = '65%'
            today.style.maxWidth = '65%'

            inbox.style.width = '35%'
            inbox.style.maxWidth = '35%'

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

    const getSettingsData = () => {
        fetch('/api/settings')
            .then(response => response.json())
            .then(data => {
                console.log(data)
                document.querySelector('.calendar__settings__avatar').src = `/static/${data.data.avatar}`
            })
    }

    // submit form
    settingsForm.addEventListener('submit', (e) => {
        e.preventDefault()
        let formData = new FormData(settingsForm);
        
        fetch('/api/settings', {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                getSettingsData()
                console.log(data)
                // close settings module
                document.querySelectorAll('.settings').forEach(settings => {
                    settings.style.display = 'none'
                })
            })  
            .catch(error => {
                console.error('Error:', error);
            });
    })

    getSettingsData()
})
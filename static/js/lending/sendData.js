document.addEventListener('DOMContentLoaded', () => {
    const header__links = document.querySelectorAll('.header__link')
    const parts = document.querySelectorAll('.part')

    const contactsForm = document.querySelector('#contactsForm')
    const contacts__message = document.querySelector('.contacts__message')

    contactsForm.addEventListener('submit', (e) => {
        e.preventDefault()

        let formData  = new FormData(contactsForm)

        fetch('/api/create-new-user', {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                console.log(data)

                let inputs = contactsForm.querySelectorAll('input')

                inputs.forEach(i => i.value = '')

                contacts__message.style.display = 'flex'

                setTimeout(() => {
                    contacts__message.style.opacity = 1
                }, 300)

                setTimeout(() => {
                    contacts__message.style.opacity = 0
                    contacts__message.style.display = 'none'
                }, 5000)
            })
    })

    document.querySelector('.try_demo').addEventListener('click', () => {
        contactsForm.scrollIntoView({ behavior: 'smooth' });
    })

    document.querySelector('.to_about').addEventListener('click', () => {
        parts[1].scrollIntoView({ behavior: 'smooth' });
    })
    

    header__links.forEach((link, i) => {
        link.addEventListener('click', () => {
            parts[i].scrollIntoView({ behavior: 'smooth' });
        })
    })
})
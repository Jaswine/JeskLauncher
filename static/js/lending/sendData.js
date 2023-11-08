document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form')
    
    form.addEventListener('submit', (e) => {
        e.preventDefault()

        const formData = new FormData(e.target)

        fetch(`/api/create-new-user`, {
            'method': 'POST',
            'body': formData
        })
            .then(res => res.json())
            .then((data) => {
                console.log(data)

                const field = form.querySelector('.send__email__field')
                const button = form.querySelector('button')
                const success =  form.querySelector('.send__email__success')

                field.style.display = 'none'
                button.style.display  = 'none'
                success.style.display  = 'block'

            })
    })
})
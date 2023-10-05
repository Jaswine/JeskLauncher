const addMoreAccounts = document.querySelector('#addMoreAccounts')
const forms = document.querySelectorAll('.included__account')

for (let i = 0; i < forms.length; i++) {
    forms[i].addEventListener('click', (e) => {
        const elem = e.target.parentNode

        let note__form = document.querySelector('.page__window')

        // Отображаем форму подтверждения удаления аккаунта
        note__form.style.display = 'flex'
        note__form.innerHTML = `
            <div class='page__window__item'>
                <h2>Do you want to delete this account?</h2>
                <div>
                    <a class = 'note__form__close'>No, close</a>
                    <span class = 'btn note__form__confirm' >Yes</span>
                </div>
            </div>
        `

        setTimeout(() => {
            note__form.style.opacity = 1
        }, 100)

        // Обработчик события клика на кнопку "Нет, закрыть"
        document.querySelector('.note__form__close').addEventListener('click', () => {
            closeNoteForm(note__form)
        })

        // Обработчик события клика на кнопку "Да" для удаления заметки
        document.querySelector('.note__form__confirm').addEventListener('click', () => {
            closeNoteForm(note__form)

            // Отправляем DELETE-запрос на сервер для удаления аккаунта
            fetch(`/api/delete-account/${parseInt(elem.querySelector('.account__id').value)}`, {
                method: 'POST'
            })
                .then(response => response.json())
                .then(data => {
                    window.location.reload()
                })
        })

    })
}

document.addEventListener('keydown', (e) => {
    if (e.code == 'Escape') {
        const page__window = document.querySelector('.page__window')

        page__window.style.opacity = 0

        setTimeout(() => {
            page__window.style.display = 'none'
        }, 300)
    }
})
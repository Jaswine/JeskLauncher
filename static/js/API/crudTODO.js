document.addEventListener('DOMContentLoaded', () => {
    let create_form = document.querySelector('#todo-create-form')
    let todo_list = document.querySelector('#todo-list')
    let todos_notification__number = document.querySelector('.inbox__add__tasks__notification__number')

    let add_note_inbox = document.querySelector('add_note_inbox')

    const showTodos = () => {
        fetch('/api/todos')
            .then(response => response.json())
            .then(data => {
                todo_list.innerHTML = ''

                todos_notification__number.innerHTML = data.size
                data.todos.forEach(todo => {
                    const div = document.createElement('div')
                    div.classList.add('note')
                    div.innerHTML = `
                        ${todo.message}
                        <a 
                            class="material-symbols-outlined note__delete" 
                            style="border: 1px solid rgb(20,20,20,.3)"
                            id = "${todo.id}"
                        >
                            close
                        </a>
                    `
                    todo_list.appendChild(div)
                })

            })
            .catch(err=> {
                console.error('Error: ', err)
            })
    }

    create_form.addEventListener('submit', (e) => {
        e.preventDefault()

        let formData = new FormData(create_form);
        
        fetch('/api/todos', {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                showTodos()
                add_note_inbox.value = ''
            })  
            .catch(error => {
                console.error('Error:', error);
            });
    })

    todo_list.addEventListener('click', (e) => {
        if (e.target.classList.contains('material-symbols-outlined')) {
            let todoItem = e.target.id;
            let note__form = document.querySelector('.note__form')

            note__form.style.display = 'flex'
            note__form.innerHTML = `
                <h2>Do you want to delete this note?</h2>
                <div>
                    <span class = 'btn note__form__close'>No, close</span>
                    <span class = 'btn note__form__confirm' >Yes</span>
                </div>
            `

            setTimeout(() => {
                note__form.style.opacity = 1
            }, 100)

            // close window
            document.querySelector('.note__form__close').addEventListener('click', () => {
                closeNoteForm(note__form)
            })

            document.querySelector('.note__form__confirm').addEventListener('click', () => {
                closeNoteForm(note__form)

                fetch(`/api/todos/${parseInt(todoItem)}`, {
                    method: 'DELETE'
                })
                    .then(response => {
                        showTodos()
                    })
                    .catch(err => {
                        console.error('Error: ', err)
                    })
            })
        }
    })

    showTodos()
})
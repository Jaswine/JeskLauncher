document.addEventListener('DOMContentLoaded', () => {
    let create_form = document.querySelector('#backlog-notes-form')
    let todo_list = document.querySelector('#backlog-notes-list')

    const showTodos = () => {
        fetch('/api/todos')
            .then(response => response.json())
            .then(data => {
                todo_list.innerHTML = ''

                data.todos.forEach(todo => {
                    const div = document.createElement('div')
                    div.classList.add('inbox__backlog__note')
                    div.innerHTML = `
                        <a 
                            class="material-symbols-outlined inbox__backlog__note__delete" 
                            id = "${todo.id}"
                        >
                            close
                        </a>
                        ${todo.message}
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
                
                create_form
                    .querySelector('.inbox__backlog__notes__form')
                    .querySelector('input')
                    .value = ''
            })      
            .catch(error => {
                console.error('Error:', error);
            });
    })

    todo_list.addEventListener('click', (e) => {
        if (e.target.classList.contains('material-symbols-outlined')) {
            let todoItem = e.target.id;

            let note__form = document.querySelector('.page__window')

            note__form.style.display = 'flex'
            note__form.innerHTML = `
                <h2>Do you want to delete this note?</h2>
                <div>
                    <a class = 'note__form__close'>No, close</a>
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
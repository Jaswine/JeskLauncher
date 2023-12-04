   // Функция для изменения стилей элементов и их родителя
const addStyles = (elem, opacity, shadow, bgcolor) => {
    // Изменяем стили для каждого элемента-потомка родительского элемента
    for (let child of elem.parentElement.children ) {
        child.style.opacity = opacity
    }

    // Изменяем тень (box-shadow) и цвет фона родительского элемента
    elem.parentElement.style.boxShadow = shadow
    elem.parentElement.style.backgroundColor = bgcolor
}

document.addEventListener('DOMContentLoaded', () => {
    // Получаем ссылку на форму для создания заметок
    let create_form = document.querySelector('#backlog-notes-form')
    // Получаем ссылку на список заметок
    let todo_list = document.querySelector('#backlog-notes-list')

    // Функция для отображения заметок
    const showTodos = () => {
        // Отправляем GET-запрос на сервер для получения данных о заметках
        fetch('/api/todos')
            .then(response => response.json())
            .then(data => {
                // Очищаем список заметок перед обновлением
                todo_list.innerHTML = ''

                // Добавляем каждую заметку в список
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

    // Получаем все input элементы с классом '.inbox__backlog__note__input'
    let inputs = document.querySelectorAll('.inbox__backlog__note__input')

    // Добавляем обработчик события для каждого input элемента
    inputs.forEach(input => {
        input.addEventListener('click', (e) => {
            if (input.checked) {
                // Если текущий input выбран, сбрасываем состояние остальных
                inputs.forEach(otherInput => {
                    if (otherInput != input) {
                        otherInput.checked = false;

                        // Применяем стили для невыбранного input
                        addStyles(otherInput, '.6', 'None', 'transparent')
                    }   
                });

                // Применяем стили для выбранного input
                addStyles(input, 1, '0 0 5px 1px RGBa(47, 0, 234, 0.46)', 'RGBa(47, 0, 234, 0.46)')
            } else {
                // Применяем стили для невыбранного input
                addStyles(input, '.6', 'None', 'transparent')
            }
        })
    })

    // Обработчик события отправки формы для создания заметки
    const sendTodo = (path, data) => { 
        // Отправляем POST-запрос на сервер для создания новых заметок
        fetch(path, {
            method: 'POST',
            body: data
        })
            .then(response => response.json())
            .then(e => {
                console.log(e)
                // Очищаем форму после создания заметки
                create_form
                    .querySelector('.inbox__backlog__notes__form')
                    .querySelector('input')
                    .value = ''
                
                // Инициализируем отображение списка заметок при удачном создании заметки
                getMessages()
                
            })      
            .catch(error => {
                console.error('Error:', error);
            });
    }

    // Добавляем обработчик события для формы
    create_form.addEventListener('submit', (e) => {
        e.preventDefault()

        // Берем все данные из формы и создаем свою
        let formData = new FormData(create_form);

        // Проверяем какой
        if (inputs[0].checked) {
            sendTodo('/api/todos', formData)
        } else if  (inputs[1].checked) {
            sendTodo('/api/google-todo/', formData)
        } else if  (inputs[2].checked) {
                sendTodo('/api/microsoft-todo/', formData)
        } else {
            sendTodo('/api/todos', formData)
        }
    })


    // Обработчик события клика на заметку для удаления
    todo_list.addEventListener('click', (e) => {
        if (e.target.classList.contains('material-symbols-outlined')) {
            let todoItem = e.target.id;

            let note__form = document.querySelector('.page__window')

            // Отображаем форму подтверждения удаления заметки
            note__form.style.display = 'flex'
            note__form.innerHTML = `
                <div class='page__window__item'>
                    <h2>Do you want to delete this note?</h2>
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

                // Отправляем DELETE-запрос на сервер для удаления заметки
                fetch(`/api/todos/${parseInt(todoItem)}`, {
                    method: 'DELETE'
                })
                    .then(response => {
                        // Обновляем список заметок после удаления
                        showTodos()
                    })
                    .catch(err => {
                        console.error('Error: ', err)
                    })
            })
        }
    })

    // Инициализируем отображение списка заметок при загрузке страницы
    showTodos()
})
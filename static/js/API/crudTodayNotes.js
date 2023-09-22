document.addEventListener('DOMContentLoaded', () => {
    // Получаем ссылку на форму для создания заметок
    let create_form = document.querySelector('#create-today-note-form');
    // Получаем ссылку на список заметок
    let todo_list = document.querySelector('#today-notes-list');

    // Функция для отображения заметок
    const showTodos = () => {
        // Отправляем GET-запрос на сервер для получения данных о заметках
        fetch('/api/today-notes')
            .then(response => response.json())
            .then(data => {
                // Очищаем список заметок перед обновлением
                todo_list.innerHTML = '';

                // Добавляем каждую заметку в список
                data.notes.forEach(todo => {
                    const div = document.createElement('div');
                    div.classList.add('inbox__backlog__note');
                    div.innerHTML = `
                        <a
                            class="material-symbols-outlined note__delete" 
                            id="${todo.id}"
                        >close</a>
                        ${todo.message}
                    `;
                    todo_list.appendChild(div);
                });
            })
            .catch(err => {
                console.error('Ошибка: ', err);
            });
    }

    // Обработчик события отправки формы для создания заметки
    create_form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Создаем объект FormData для передачи данных формы
        let formData = new FormData(create_form);

        // Отправляем POST-запрос на сервер для создания новой заметки
        fetch('/api/today-notes', {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                // Обновляем список заметок после создания новой
                showTodos();

                // Очищаем поле ввода формы после создания заметки
                create_form
                    .querySelector('.inbox__backlog__notes__form')
                    .querySelector('input')
                    .value = '';
            })
            .catch(error => {
                console.error('Ошибка:', error);
            });
    })

    // Обработчик события клика на заметку для удаления
    todo_list.addEventListener('click', (e) => {
        if (e.target.classList.contains('material-symbols-outlined')) {
            let todoItem = e.target.id;
            let note__form = document.querySelector('.page__window');

            // Отображаем форму подтверждения удаления заметки
            note__form.style.display = 'flex';
            note__form.innerHTML = `
                <h2>Are you sure you want to delete this note?</h2>
                <div>
                    <a class='note__form__close'>No, close</a>
                    <span class='btn note__form__confirm'>Yes</span>
                </div>
            `;
            setTimeout(() => {
                note__form.style.opacity = 1;
            }, 100);

            // Обработчик события клика на кнопку "Нет, закрыть"
            document.querySelector('.note__form__close').addEventListener('click', () => {
                closeNoteForm(note__form);
            })

            // Обработчик события клика на кнопку "Да" для удаления заметки
            document.querySelector('.note__form__confirm').addEventListener('click', () => {
                closeNoteForm(note__form);

                // Отправляем DELETE-запрос на сервер для удаления заметки
                fetch(`/api/today-notes/${parseInt(todoItem)}`, {
                    method: 'DELETE'
                })
                    .then(response => {
                        // Обновляем список заметок после удаления
                        showTodos();
                    })
                    .catch(err => {
                        console.error('Ошибка: ', err);
                    })
            })
        }
    })

    // Инициализируем отображение списка заметок при загрузке страницы
    showTodos();
})

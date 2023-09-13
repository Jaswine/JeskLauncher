// Функция для закрытия формы
function closeNoteForm(form) {
    // Скрываем форму
    form.style.display = 'none';
    // Очищаем внутреннее содержимое формы
    form.innerHTML = '';
    // Устанавливаем непрозрачность элемента в 0, что делает его полностью прозрачным
    form.style.opacity = 0;
}


const chillMode = document.querySelector('#chillMode')
const chillModeClose = document.querySelector('#chill__mode__exit')

const openChillMode = () => {
    const chill__mode = document.querySelector('#chill__mode')

    for (const column of document.querySelectorAll('.column')) {
        column.style.opacity = 0
    }

    setTimeout(() => {
        chill__mode.style.opacity = 1
        chill__mode.style.display = 'flex'
    }, 300)
}

const closeChillMode = () => {
    const chill__mode = document.querySelector('#chill__mode')

    chill__mode.style.opacity = 0
    chill__mode.style.display = 'none'

    setTimeout(() => {
        for (const column of document.querySelectorAll('.column')) {
            column.style.opacity = 1
        }
    }, 300) 
}

chillMode.onclick = openChillMode
chillModeClose.onclick = closeChillMode
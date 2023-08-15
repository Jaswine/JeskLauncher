document.addEventListener('DOMContentLoaded', () => {

    const columns = document.querySelectorAll('.column')

    const chillMode = document.querySelector('#chillMode')
    const chillModeClose = document.querySelector('#chill__mode__exit')
    const chill__mode = document.querySelector('#chill__mode')

    const openChillMode = () => {
        console.log('open chill mode')
        for (const column of columns) {
            column.style.opacity = 0
        }

        setTimeout(() => {
            chill__mode.style.opacity = 1
            chill__mode.style.display = 'flex'
        }, 300)
    }

    const closeChillMode = () => {
        console.log('close chill mode')
        chill__mode.style.opacity = 0
        chill__mode.style.display = 'none'

        setTimeout(() => {
            for (const column of columns) {
                column.style.opacity = 1
            }
        }, 300) 
    }

    chillMode.onclick = openChillMode
    chillModeClose.onclick = closeChillMode
})
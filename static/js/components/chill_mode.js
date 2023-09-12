
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
        
        NatureSoundsAudio.play()
        equalizer__image.classList.add('equalizer__image__animation')
    }, 300)
}

const closeChillMode = () => {
    const chill__mode = document.querySelector('#chill__mode')

    chill__mode.style.opacity = 0
    chill__mode.style.display = 'none'

    NatureSoundsAudio.pause();
    equalizer__image.classList.remove('equalizer__image__animation')

    setTimeout(() => {
        for (const column of document.querySelectorAll('.column')) {
            column.style.opacity = 1
        }
    }, 300) 
}

chillMode.onclick = openChillMode
chillModeClose.onclick = closeChillMode

const equalizer__triangle = document.querySelector('.equalizer__triangle')
const equalizer__image = document.querySelector('.equalizer__image')

equalizer__triangle.addEventListener('click', () => {
    if (equalizer__triangle.childElementCount == 2) {
        equalizer__triangle.innerHTML = `
            <span class='triangle'></span>
        `
        NatureSoundsAudio.pause();
        equalizer__image.classList.remove('equalizer__image__animation')
    } else {
        equalizer__triangle.innerHTML = `
            <span class="line"></span>
            <span class="line"></span>
        `
        NatureSoundsAudio.play();
        equalizer__image.classList.add('equalizer__image__animation')
    }
})

const equalizer__spans =  document.querySelector('.equalizer__spans');

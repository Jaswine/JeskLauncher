document.addEventListener('DOMContentLoaded', () => {
    let loadSeconds = 0
    let loadSeconds2 = 0

    const getMessages = async () => {
        console.log('get Messages... ')
        const response = await fetch('/api/messages')
        const data = await response.json()
        console.log(data)
        console.log(`Data from social messages loaded successfully! Seconds: ${loadSeconds} ✅`)
    }

    const getMessages2= async () => {
        console.log('get Messages 2...')
        const response = await fetch('/api/messages2/')
        const data = await response.json()
        console.log(data)
        console.log(`Data from social messages 2 loaded successfully! Seconds: ${loadSeconds2} ✅`)
    }

    getMessages()
    getMessages2()

    setInterval(() => {
        console.log('1 секунда');
        loadSeconds+= 1
        loadSeconds2 +=1
    }, 1000);
})
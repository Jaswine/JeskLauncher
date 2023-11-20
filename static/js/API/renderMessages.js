document.addEventListener('DOMContentLoaded', () => {
    let loadSeconds = 0

    const getMessages = async () => {
        console.log('get Messages...')
        const response = await fetch('/api/messages')
        const data = await response.json()
        console.log(data)
        console.log(`Data loaded successfully! Seconds: ${loadSeconds} ✅`)
    }

    getMessages()

    setInterval(() => {
        // console.log('1 секунда');
        loadSeconds+=1
    }, 1000);
})
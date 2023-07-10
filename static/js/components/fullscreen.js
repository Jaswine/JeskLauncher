// Full Screen
const FullScreen = document.getElementById('FullScreen')


FullScreen.onclick = () => {
    if (document.documentElement.requestFullscreen()) {
       document.exitFullscreen()
    } else{
       document.documentElement.requestFullscreen()
    }
 }
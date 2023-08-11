// TODO: Full screen
document.querySelector('#fullScreen').onclick = () => {
    if (document.documentElement.requestFullscreen()) {
       document.exitFullscreen()
    } else{
       document.documentElement.requestFullscreen()
    }
 }
// Обработчик клика на кнопку "Full Screen"
document.querySelector('#fullScreen').onclick = () => {
   if (document.documentElement.requestFullscreen()) {
       // Если на странице уже установлен полноэкранный режим, то выходим из него
       document.exitFullscreen();
   } else {
       // В противном случае, запросить полноэкранный режим для документа
       document.documentElement.requestFullscreen();
   }
}

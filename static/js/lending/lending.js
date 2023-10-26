// document.addEventListener('DOMContentLoaded', () => {
//     const line1 = document.querySelector('.intro__left__line__one')
//     const line2 = document.querySelector('.intro__left__line__two')

//     const insta = document.querySelector('.intro__left__icons__insta')
//     const telega = document.querySelector('.intro__left__icons__telega')

//     window.addEventListener('scroll', (e) => {
//         let scrollPosition = window.scrollY;
    
//         // Высота контента минус высота окна браузера
//         let contentHeight1 = document.querySelector('.page').offsetHeight;
//         let windowHeight = window.innerHeight;
    
//         if (scrollPosition > windowHeight / 10 &&  scrollPosition < contentHeight1) {
//             let scaleHeight = (scrollPosition /  (contentHeight1 - 300) * 100)

//             // console.log(scaleHeight)
//             if (scaleHeight < 15) {
//                 line1.style.height = scaleHeight * 7 < (0.8 * windowHeight) ? scaleHeight * 7 + '%' : (0.4 * windowHeight) + '%';
//             } else if ( 15  < scaleHeight < 18 ) {
//                 insta.style.opacity = '1'
//                 telega.style.opacity = '1'
//             } 
            
//             if (scaleHeight > 18) {
//                 console.log(scaleHeight)
//                 line2.style.height = scaleHeight * 1 + '%';
//             }

//             if (scaleHeight > 80) {
//                 line2.style.height = 0.1635 * windowHeight + '%';
//             }
//         }
//     });
    
// })
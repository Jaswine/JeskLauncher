document.addEventListener('DOMContentLoaded', () => {
    function onButtonClick(event) {
        event.preventDefault();
        // window.scrollTo({ top: document.querySelector(event.target.title).offsetTop })
        const targetSection = document.querySelector(event.target.title);
        const targetSectionOffsetTop = targetSection.offsetTop;
    
        window.scrollTo({
          top: targetSectionOffsetTop,
          behavior: 'smooth',
        });
      }

      document.querySelectorAll(".butn_link").forEach((button) => {
        button.addEventListener("click", onButtonClick)
      })

     document.querySelector('.mobile__icon__button').onclick = () => {
      let menu = document.querySelector('.header__menu')
      if (menu.style.top != "80px") {
        menu.style.top = "80px"
      } else {
        menu.style.top = "-1000%"
      }
    }
})
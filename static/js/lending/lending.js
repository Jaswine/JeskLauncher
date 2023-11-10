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
})
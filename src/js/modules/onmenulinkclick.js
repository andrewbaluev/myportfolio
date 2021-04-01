/*
 * Плавный скролл и закрытие меню по клике на ссылку
 */

const menuLinks = document.querySelectorAll('.menu-item__link[data-goto]');

const linkClick = () => {

    function onMenuLinkClick(e) {
        const menuLink = e.target;
        const headerInner = document.querySelector('.header-inner');
        if (menuLink.dataset.goto && document.querySelector(menuLink.dataset.goto)) {
            const gotoBlock = document.querySelector(menuLink.dataset.goto);
            const gotoBlockValue = gotoBlock.getBoundingClientRect().top + pageYOffset - document.querySelector('header').offsetHeight;

            if (headerInner.classList.contains('_active')) {
                document.body.classList.remove('_lock');
                headerInner.classList.remove('_active');
            }

            window.scrollTo({
                top: gotoBlockValue,
                behavior: "smooth"
            });
            e.preventDefault();
        }
    }

    if (menuLinks.length > 0) {
        menuLinks.forEach(menuLink => {
            menuLink.addEventListener('click', onMenuLinkClick);
        });
    }

};

export default linkClick;
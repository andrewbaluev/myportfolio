const burger = () => {
    const menuOpenBtn = document.querySelector('.menu-icon__open');
    const menuCloseBtn = document.querySelector('.menu-icon__close');
    const headerInner = document.querySelector('.header-inner');

    menuOpenBtn.addEventListener('click', () => {
        document.body.classList.add('_lock');
        headerInner.classList.add('_active');
    });

    menuCloseBtn.addEventListener('click', () => {
        document.body.classList.remove('_lock');
        headerInner.classList.remove('_active');
    });
};

export default burger;
/*
* Фиксированный header
*/

const fixHeader = () => {
    let header = document.querySelector('#header');
    if (header) {
        const headerScrolled = () => {
            if (window.scrollY > 50) {
                header.classList.add('header-scrolled');
            } else {
                header.classList.remove('header-scrolled');
            }
        };
        // window.addEventListener('load', headerScrolled);
        document.addEventListener('scroll', headerScrolled);
    }
};

export default fixHeader;
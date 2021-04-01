/*
* Animation on scroll
*/

const aos = () => {
    AOS.init({
        duration: 1000,
        delay: 100,
        easing: 'ease-in-out',
        once: true,
        mirror: false
    });
};

export default aos;
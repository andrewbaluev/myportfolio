/*
* Porfolio isotope and filter
*/

const isotope = () => {
    const portfolioGrid = document.querySelector('#portfolio-grid');
    const isotope = new Isotope(portfolioGrid, {
        itemSelector: '.portfolio-item',
        layoutMode: 'fitRows'
    });

    let filterBtn = document.querySelectorAll('.portfolio-filters .filter-btn');
    for (let i = 0; i < filterBtn.length; i++) {
        // Если кликнули по ссылке
        filterBtn[i].onclick = (e) => {
            // Отменяем переход
            e.preventDefault();
            // Получаем значение дата-атрибута кнопки
            let filterData = event.target.getAttribute('data-filter');
            // Применяем фильтрацию элементов в Isotope
            isotope.arrange({
                filter: filterData
            });
        };
    }
};

export default isotope;

let isConnected = navigator.onLine;
document.addEventListener('DOMContentLoaded', (event) => {
    if (!isConnected) {
        showToast(`Viewing content in offline!!`);
    }

    fetchCategories();
});


/**
*
* @description Build category page URL
* @param {string} category - categeory name
* @author Istiaque Siddiqi
*/
const urlForCategory = (category) => {
    return (`./category.html?q=${category}`);
}


/**
 *
 * @description Fetch all categories
 * @author Istiaque Siddiqi
 */
const fetchCategories = () => {
    try {
        const ul = document.getElementById('categories-list');
        GIF_CATEGORIES.forEach(category => {
            ul.appendChild(createCategoryCard(category));
        });
        loadLazyImage();
    } catch (error) {
        logErrorMsg(error, `fetchCategories`);
    }
};


/**
 *
 * @description Create different gif category by category name
 * @param {string} category - category name
 * @author Istiaque Siddiqi
 */
const createCategoryCard = (category) => {
    category = category.toLowerCase();
    const li = document.createElement('li');
    const href = document.createElement('a');
    href.href = urlForCategory(category.toLowerCase());

    const card = document.createElement('div');
    card.className = 'card ripple-effect';
    // card.style = 'width: 8vw;';

    const img = document.createElement('img');
    img.className = 'card-img';
    img.style = 'height: 16vh';
    img.src = `img/placeholder.png`;
    img.setAttribute('data-src', `img/${category}.webp`);
    img.setAttribute('data-srcset', `img/${category}.webp`);
    img.alt = `${category} Category`;
    card.appendChild(img);

    const cardContent = document.createElement('div');
    cardContent.className = 'card-content';
    const categoryName = document.createElement('h3');
    // categoryName.style = 'font-size: .8vw;';
    categoryName.setAttribute('tabindex','0');
    categoryName.setAttribute('aria-label',category);
    categoryName.innerText = category;
    cardContent.appendChild(categoryName);
    card.appendChild(cardContent);

    href.appendChild(card);
    li.appendChild(href);
    return li;
}

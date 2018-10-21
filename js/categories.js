
let isConnected = navigator.onLine;
document.addEventListener('DOMContentLoaded', (event) => {
    if (!isConnected) {
        showToast(`Viewing content in offline!!`);
    }

    fetchCategories();
});


/**
 * 
 * @description Fetch all categories 
 * @author Istiaque Siddiqi
 */
const fetchCategories = () => {
    const ul = document.getElementById('categories-list');
    GIF_CATEGORIES.forEach(category => {
        ul.appendChild(createCategoryCard(category));
    });
};


/**
 * 
 * @description Create different gif category by category name
 * @param {string} category - category name
 * @author Istiaque Siddiqi
 */
const createCategoryCard = (category) => {
    const li = document.createElement('li');
    const href = document.createElement('a');
    href.href = 'category.html';

    const card = document.createElement('div');
    card.className = 'card ripple-effect';
    card.style = 'width: 8vw;';

    const img = document.createElement('img');
    img.className = 'card-img';
    img.style = 'height: 16vh';
    img.src = 'img/giphy.webp';
    img.alt = '';
    card.appendChild(img);

    const cardContent = document.createElement('div');
    cardContent.className = 'card-content';
    const categoryName = document.createElement('h5');
    categoryName.style = 'font-size: .8vw;';
    categoryName.innerText = category;
    cardContent.appendChild(categoryName);
    card.appendChild(cardContent);

    href.appendChild(card);
    li.appendChild(href);
    return li;
}
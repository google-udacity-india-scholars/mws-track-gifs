
let isConnected = navigator.onLine;
document.addEventListener('DOMContentLoaded', (event) => {
    if (!isConnected) {
        showToast(`Viewing content in offline!!`);
    }

    fetchTrendingGifs();
});


/**
 * @description Get all trending GIFS
 * @author Istiaque Siddiqi
 */
const fetchTrendingGifs = async () => {
    try {
        let gifs = await DBHelper.getTrendingGifs();
        setTrendingList(gifs);
        loadLazyImage();
    } catch (error) {
        logErrorMsg(error, `fetchTrendingGifs`);
    }
}


/**
 *
 * @description Set all trending gifs
 * @param {object} gifs - list of gifs object
 * @author Istiaque Siddiqi
 */
const setTrendingList = (gifs) => {
    const ul = document.getElementById('gif-list');
    gifs.forEach(gif => {
        ul.appendChild(createGifCard(gif));
    });
}


/**
 * @description Creates trending gifs cards
 * @param {object} gif - gif object
 * @author Istiaque Siddiqi
 */
const createGifCard = (gif) => {
    const li = document.createElement('li');

    const card = document.createElement('div');
    card.className = 'card ripple-effect';
    // card.style = 'width: 16vw;';

    const img = document.createElement('img');
    img.className = 'card-img lazy';
    img.src = `img/placeholder.png`;
    img.setAttribute('data-src', gif.img);
    img.setAttribute('data-srcset', gif.img);
    img.alt = `${gif.title} Gif`;
    card.appendChild(img);

    const cardContent = document.createElement('div');
    cardContent.className = 'card-content';
    const title = document.createElement('h3');
    // title.style = 'font-size: 1vw;';
    title.innerText = gif.title;
    title.setAttribute('tabindex', '0');
    title.setAttribute('aria-label', gif.title);
    cardContent.appendChild(title);
    card.appendChild(cardContent);

    const cardAction = document.createElement('div');
    cardAction.className = 'card-action';
    const btn_fav = document.createElement('button');

    btn_fav.setAttribute('aria-label', `Mark ${gif.title} favorite/unfavorite`);
    btn_fav.setAttribute('tabindex', '0');
    btn_fav.id = `btn_favourite_${gif.id}`;
    btn_fav.className = `btn_favourite${(gif.isFavorite === true) ? ' isFavourite' : ""}`;
    btn_fav.innerHTML = `<svg width="25" height="25" class="unmark"><g><title>background</title>
    <rect fill="none" id="canvas_background" height="27" width="27" y="-1" x="-1" /></g>
    <g><title>Favorite</title><path stroke="null" id="svg_1" fill="none" d="m0.207553,1l15.962492,0l0,13.698355l-15.962492,0l0,-13.698355z" />
    <path fill="#bdbdbd" stroke="null" id="svg_2" d="m12.490655,24.907681l-1.808404,-1.770061c-6.422952,-6.292801 -10.663348,-10.445377 -10.663348,-15.52673c0,-4.152576 3.011928,-7.403295 6.859463,-7.403295c2.170085,0 4.252867,1.090304 5.612288,2.806522c1.359421,-1.716218 3.442203,-2.806522 5.612288,-2.806522c3.847535,0 6.859463,3.25072 6.859463,7.403295c0,5.081353 -4.240396,9.233928 -10.663348,15.52673l-1.808404,1.770061z"/>
    </g></svg>
    <svg width="25" height="25" class="mark"><g><title>background</title>
    <rect fill="none" id="canvas_background" height="27" width="27" y="-1" x="-1" /></g>
    <g><title>Favorite</title><path stroke="null" id="svg_1" fill="none" d="m0.207553,1l15.962492,0l0,13.698355l-15.962492,0l0,-13.698355z" />
    <path fill="#f44336" stroke="null" id="svg_2" d="m12.490655,24.907681l-1.808404,-1.770061c-6.422952,-6.292801 -10.663348,-10.445377 -10.663348,-15.52673c0,-4.152576 3.011928,-7.403295 6.859463,-7.403295c2.170085,0 4.252867,1.090304 5.612288,2.806522c1.359421,-1.716218 3.442203,-2.806522 5.612288,-2.806522c3.847535,0 6.859463,3.25072 6.859463,7.403295c0,5.081353 -4.240396,9.233928 -10.663348,15.52673l-1.808404,1.770061z"/>
    </g></svg>`;

    btn_fav.addEventListener('click', (e) => {
        document.getElementById(`btn_favourite_${gif.id}`).classList.toggle('isFavourite');
        DBHelper.toggleFavorite('trending-gifs', gif.id);
    });
    cardAction.appendChild(btn_fav);

    const btn_share = document.createElement('button');
    btn_share.className = 'btn_share';
    btn_share.setAttribute('aria-label', `share ${gif.title}`);
    btn_share.setAttribute('tabindex', '0');
    btn_share.innerHTML = ` <svg width="24" height="24"><g><title>background</title>
    <rect fill="none" id="canvas_background" height="26" width="26" y="-1" x="-1" /></g><g>
    <title>Share</title><path fill="#bdbdbd" stroke="null" id="svg_1" d="m19.861938,15.527999c-1.160541,0 -2.204392,0.48583 -2.945537,1.261215l-8.659869,-4.218947c0.029782,-0.198219 0.050288,-0.398866 0.050288,-0.605344c0,-0.201134 -0.01953,-0.397409 -0.047847,-0.590283l8.647174,-4.172794c0.741633,0.7817 1.790367,1.272389 2.95579,1.272389c2.246869,0 4.068483,-1.812632 4.068483,-4.048421c0,-2.236275 -1.821614,-4.048421 -4.068483,-4.048421s-4.068483,1.812146 -4.068483,4.048421c0,0.201134 0.01953,0.396923 0.047847,0.590283l-8.647174,4.172794c-0.741633,-0.7817 -1.789879,-1.272389 -2.95579,-1.272389c-2.247357,0 -4.068483,1.812632 -4.068483,4.048421c0,2.236275 1.821126,4.048421 4.068483,4.048421c1.160541,0 2.204392,-0.48583 2.945537,-1.261215l8.659869,4.218947c-0.029782,0.197733 -0.050288,0.398866 -0.050288,0.605344c0,2.236275 1.821614,4.048421 4.068483,4.048421s4.068483,-1.812146 4.068483,-4.048421c0,-2.236275 -1.821614,-4.048421 -4.068483,-4.048421z"/>
    </g></svg>`;

    btn_share.addEventListener('click', (e) => {
        if (navigator.share) {
            // Web Share API is supported
            navigator.share({
                url: gif.img,
            }).then(() => console.log('Successful share'))
            .catch((error) => console.log('Error sharing', error));
        } else {
            // Fallback if Web Share API is not supported
            console.log('Web Share API is not supported');
            let inputText = document.createElement('input');
            inputText.setAttribute('type', 'text');
            inputText.setAttribute('value', gif.img);
            document.body.appendChild(inputText);
            inputText.select();
            document.execCommand('copy'); // method is not supported in IE8 and earlier
            document.body.removeChild(inputText);
            showToast(`Link copied to clipboard`);
        }
    });
    cardAction.appendChild(btn_share);
    card.appendChild(cardAction);

    li.appendChild(card);
    return li;
}

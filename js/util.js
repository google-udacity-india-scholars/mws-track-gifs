
/**
 * Utility Functions
 */

/**
 * 
 * @description This method is a utility function to log error message on console
 * @param {object} error - error object
 * @param {string} methodName - method name where error happened
 * @author Istiaque Siddiqi
 */
const logErrorMsg = (error, methodName) => {
    console.log(`%c*********************** ERROR | ${Date()} | Method: ${methodName} ***********************`, 'color: white; background-color: red; padding: 4px');
    console.log(error.message);
    console.log(error.stack);
    console.trace();
    console.log(`%c******************************************************************* END *******************************************************************`, 'color: white; background-color: red; padding: 4px');
}

/**
 * @description Method to show snackbar
 * @param {string} toastMsg - Toast message
 * @author Istiaque Siddiqi
 */
const showToast = (toastMsg) => {
    Snackbar.show({
        text: toastMsg,
        actionText: 'OK',
        actionTextColor: '#f44336',
        textColor: '#fff',
        pos: 'bottom-center'
    });
}

/**
 * 
 * @description Checks for online presence
 * @param {object} event 
 * @author Istiaque Siddiqi
 */
const isOnline = (event) => {
    let toastMsg;
    if (event.type === "offline") {
        console.log(`You lost connection.`);
        toastMsg = `You lost connection.`
        isConnected = false;
    } else if (event.type === "online") {
        console.log(`You are now online.`);
        toastMsg = `You are now online.`;
        isConnected = true;
    }
    showToast(toastMsg);
}
window.addEventListener('online', isOnline);
window.addEventListener('offline', isOnline);


//  GIF Categories
const GIF_CATEGORIES = new Set([
    'Waiting', 'Thank You', 'Shocked', 'No', 'Laughing', 'Thumbs Up', 'Popcorn',
    'Good Luck', 'Eye Roll', 'Cats', 'Dogs', 'Classics', 'Congratulations', 'Dancing', 'Mind Blown',
    'Excited', 'Confused', 'Love', 'Yes', 'Good Morning', 'Good Night', 'Miss You', 'Friendship', 'Get Well', 'Sympathy', 'Compliments',
    'Birthday', 'Graduation', 'Engagement & Wedding', 'Anniversary', 'New Baby',
    'Halloween', 'Diwali', 'Christmas', 'New Year', 'Valentine\'s Day', 'Mother\'s Day',
    'Father\'s Day', 'Eid Mubarak', 'High Five', 'Clapping', 'Shrug', 'Sorry', 'Cheers',
    'Wink', 'Angry', 'Nervous', 'Oops', 'Hungry', 'Hugs', 'Wow', 'Bored', 'Awkward',
    'Aww', 'Please', 'Yikes', 'OMG', 'Bye', 'Loser', 'Cold', 'Party', 'Excuse Me', 'What',
    'Stop', 'Sleepy', 'Creep', 'Scared', 'Chill Out', 'Done'
].sort());


/**
 * 
 * @description This method is used to shorten the title to two words at most and 
 * if webp format is not available than fallback to another fomrat
 * @param {object} gifs - JSON object
 * @author Istiaque Siddiqi
 */
const customizeGifObject = (gifs) => {
    return new Promise((resolve, reject) => {
        let gifList = [];
        Promise.all(gifs.map(async gif => {
            let id = gif.id;
            let title = gif.title;
            let isFavorite = await DBHelper.isItFavorite(id);
            title = title.split(' ');
            // getting only first two word from title
            title = (title.length === 1) ? `${title[0]}` : `${title[0]} ${title[1]}`;
            title = title.toUpperCase();

            let img = gif.images.original;
            // Fallback if webp format is not available
            img = ((img.webp === '') || (img.webp === undefined) || (img.webp === null)) ? img.url : img.webp;
            gifList.push({ id, img, title, isFavorite });
        })).then(() => {
            resolve(gifList);
        }).catch(err => reject(err));
    });
}


/**
 * 
 * @description Lazy loading gifs defer loading of gifs at later 
 * point of time when they are needed just to improve the page load time
 * and avoids unnessary utilization of system resources and user's data plan
 * @author Istiaque Siddiqi
 */
const loadLazyImage = () => {
    let lazyImages = document.querySelectorAll('img[data-src]');
    if ('IntersectionObserver' in window) {
        let lazyImageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    lazyLoadImage(entry.target);
                    lazyImageObserver.unobserve(entry.target);
                }
            });
        });

        lazyImages.forEach(img => {
            lazyImageObserver.observe(img);
        });
    } else {
        lazyImages.forEach(img => {
            lazyLoadImage(img);
        });
    }
}


/**
 * 
 * @param {object} image
 * @author Istiaque Siddiqi
 */
const lazyLoadImage = (image) => {
    image.setAttribute('src', image.getAttribute('data-src'));
    image.onload = () => {
        image.removeAttribute('data-src');
    };
};


/**
* 
* @description Build and redirect to search page URL
* @param {string} query - query string to search gifs
* @author Istiaque Siddiqi
*/
const search = () => {
    try {
        if(document.getElementById('q').value.length)
        window.location.href = `./search.html?q=${document.getElementById('q').value}`;
    } catch (error) {
        logErrorMsg(error, `search`);
    }
}

// Event listener to key stroke in search box
document.getElementById('q').addEventListener('keydown', debounced(1000, search));
/**
 * 
 * @description Trigger api call only after user stops typing in search box using debounce technique
 * @param {number} delay - time in millisecond
 * @param {function} fn - function name
 */
function debounced(delay, fn) {
    let timerId;
    return function (...args) {
        if (timerId) {
            clearTimeout(timerId);
        }
        timerId = setTimeout(() => {
            fn(...args);
            timerId = null;
        }, delay);
    }
}


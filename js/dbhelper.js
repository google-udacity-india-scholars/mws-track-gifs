
/**
 * @description Common database helper functions.
 */
class DBHelper {

    /**
     * @description Get your API KEY from https://giphy.com/
     * @returns apikey
     * @author Istiaque Siddiqi
     */
    static get API_KEY() {
        // add api key
        const apiKey = `YOUR_API_KEY`;
        return apiKey;
    }

    /**
     * @description API Base URL
     * @returns api base URL
     * @author Istiaque Siddiqi
     */
    static get API_BASE_URL() {
        return `https://api.giphy.com/v1/gifs`;
    }

    static createDB() {
        return idb.open('gify', 1, upgradeDB => {
            switch (upgradeDB.oldVersion) {
                case 0:
                    console.log('Creating object stores');
                    upgradeDB.createObjectStore('trending-gifs', {
                        keyPath: 'id',
                        autoIncrement: true
                    });
                    upgradeDB.createObjectStore('category-gifs', {
                        keyPath: 'id',
                        autoIncrement: true
                    })
            }
        })
    }

    /**
     * @description Fetch data from network.
     * This is a common method used for all network calls
     * @param {string} url - API endpoint
     * @author Istiaque Siddiqi
     */
    static getServerData(url) {
        return new Promise(async (resolve, reject) => {
            let response;
            try {
                response = await fetch(url);
                if (!response.ok) { // Didn't get a success response from server!
                    return reject(Error(response.statusText));
                }
                return resolve(response.json());
            } catch (error) {
                logErrorMsg(error, `getServerData`);
                return reject(error.stack);
            }
        });
    }


    /**
     * @description Fetch all trending gifs
     * @author Istiaque Siddiqi
     */
    static getTrendingGifs() {
        return new Promise(async (resolve, reject) => {
            try {
                const dbPromise = this.createDB();
                let db = await dbPromise;
                let tx = db.transaction(['trending-gifs']);
                let store = tx.objectStore('trending-gifs');
                let gifs = await store.getAll();
                tx.complete;
                if (gifs.length === 0) {
                    const apiEndpoint = `${DBHelper.API_BASE_URL}/trending?api_key=${DBHelper.API_KEY}&limit=25&rating=G`;
                    gifs = await this.getServerData(apiEndpoint);
                    gifs = customizeGifObject(gifs.data);
                    db = await dbPromise;
                    tx = db.transaction(['trending-gifs'], 'readwrite');
                    store = tx.objectStore('trending-gifs');
                    Promise.all(gifs.map(gif => {
                        return store.add(gif);
                    }));
                    resolve(gifs);
                } else {
                    resolve(gifs);
                }
            } catch (error) {
                logErrorMsg(error, `getTrendingGifs`);
                return reject(error.stack);
            }
        });
    }


    /**
     *
     * @description Get a gif for category
     * @author Istiaque Siddiqi
     */
    static getGifsByCategoryName(category) {
        return new Promise(async (resolve, reject) => {
            let response;
            try {
                const dbPromise = this.createDB();
                let db = await dbPromise;
                let tx = db.transaction(['category-gifs']);
                let store = tx.objectStore('category-gifs');
                let gifs = await store.getAll();
                tx.complete;
                gifs = gifs.filter(gif => gif.category === category);
                if (gifs.length === 0) {
                    const apiEndpoint = `${DBHelper.API_BASE_URL}/search?api_key=${DBHelper.API_KEY}&q=${category}&limit=25&offset=0&rating=G&lang=en`;
                    gifs = await this.getServerData(apiEndpoint);
                    console.log(gifs);
                    gifs = customizeGifObject(gifs.data);
                    gifs.map(gif => gif['category'] = category);
                    db = await dbPromise;
                    tx = db.transaction(['category-gifs'], 'readwrite');
                    store = tx.objectStore('category-gifs');
                    Promise.all(gifs.map(gif => {
                        return store.add(gif);
                    }));
                    tx.complete;
                    resolve(gifs);
                } else {
                    resolve(gifs);
                }
            } catch (error) {
                logErrorMsg(error, `getGifsByCategoryName`);
                return reject(error.stack);
            }
        });
    }

}

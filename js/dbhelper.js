
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
        return idb.open('gify', 2, upgradeDB => {
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
                case 1:
                    upgradeDB.createObjectStore('favorite-gifs', {
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
     * @description Clear all data in a object store
     * @param {string} storeName - Name of object store
     * @returns Promise
     * @author C Dharmateja
     */
    static clearStore(storeName) {
        return new Promise( async (resolve, reject) => {
            try {
                const db = await this.createDB();
                const tx = db.transaction(storeName, 'readwrite');
                const store = tx.objectStore(storeName);
                await store.clear();
                tx.complete;
                resolve(`${storeName} was cleared!`);
            } catch (error) {
                reject(`Couldn't clear store`);
                logErrorMsg(error, `clearStore`);
                return reject(error.stack);
            }
        });
    }

    /**
     * @description Get all data in a object store
     * @param {string} name - Name of object store
     * @returns Promise
     * @author C Dharmateja
     */
    static getDataFromDB(name) {
        return new Promise(async (resolve, reject) => {
            try {
                const db = await this.createDB();
                const tx = db.transaction(name);
                const store = tx.objectStore(name);
                const gifs = await store.getAll();
                tx.complete;
                resolve(gifs);
            } catch (error) {
                reject(`Couldn't get data from idb`);
                logErrorMsg(error, `getDataFromDB`);
                return reject(error.stack);
            }
        })
    }

    /**
     * @description Add gif to object store
     * @param {string} name - Name of object store
     * @param {Object} gif - GIF object
     * @returns Promise
     * @author C Dharmateja
     */
    static addGifToDB(name, gif) {
        return new Promise( async (resolve, reject) => {
            try {
                const db = await this.createDB();
                const tx = db.transaction(name, 'readwrite');
                const store = tx.objectStore(name);
                await store.add(gif);
                tx.complete;
                resolve(`Successfully added to ${name}`)
            } catch (error) {
                logErrorMsg(error, `addGifToDB`);
                reject(error.stack);
            }
        })
    }

    /**
     * @description Delete GIF from object store
     * @param {string} name - Name of object store
     * @param {Object} gif - GIF object
     * @returns Promise
     * @author C Dharmateja
     */
    static deleteGifFromDB(name, gif) {
        return new Promise(async (resolve, reject) => {
            try {
                const db = await this.createDB();
                const tx = db.transaction(name, 'readwrite');
                const store = tx.objectStore(name);
                await store.delete(gif.id);
                resolve(`Successfully deleted from ${name}`);
            } catch(error) {
                logErrorMsg(`${error} deletedGifFromDB`);
            }
        })
    }

    /**
     * @description Add gifs to object store
     * @param {string} name - Name of object store
     * @param {Object} gifs - Array of gifs
     * @returns Promise
     * @author C Dharmateja
     */
    static addGifsToDB(name, gifs) {
        return new Promise( async (resolve, reject) => {
            try {
                const db = await this.createDB();
                const tx = db.transaction(name, 'readwrite');
                const store = tx.objectStore(name);
                Promise.all(gifs.map(async gif => {
                    await store.add(gif);
                })).catch(err => console.log(err));
                tx.complete;
                resolve('Gifs successfully added to DB');
            } catch (error) {
                logErrorMsg(error, `addGifsToDB`);
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
                // If user is online fetch gifs from API else from idb
                if (navigator.onLine) {
                    const apiEndpoint = `${DBHelper.API_BASE_URL}/trending?api_key=${DBHelper.API_KEY}&limit=25&rating=G`;
                    let gifs = await this.getServerData(apiEndpoint);
                    gifs = await customizeGifObject(gifs.data);
                    await this.clearStore('trending-gifs');
                    await this.addGifsToDB('trending-gifs', gifs);
                    resolve(gifs);
                } else {
                    const gifs = await this.getDataFromDB('trending-gifs');
                    resolve(gifs);
                }
            } catch (error) {
                logErrorMsg(error, `getTrendingGifs`);
                return reject(error.stack);
            }
        });
    }

    /**
     * @description Get all gifs in a object store
     * @returns Promise
     * @author C Dharmateja
     */
    static getFavoriteGifs() {
        return new Promise(async (resolve, reject) => {
            try {
                const gifs = await this.getDataFromDB('favorite-gifs');
                resolve(gifs);
            } catch(error) {
                logErrorMsg(error, 'getFavoriteGifs');
                reject(error.stack);
            }
        })
    }

    /**
     *
     * @description Get a gif for category
     * @author Istiaque Siddiqi
     */
    static getGifsByCategoryName(category) {
        return new Promise(async (resolve, reject) => {
            try {
                if (navigator.onLine) {
                    const apiEndpoint = `${DBHelper.API_BASE_URL}/search?api_key=${DBHelper.API_KEY}&q=${category}&limit=25&offset=0&rating=G&lang=en`;
                    let gifs = await this.getServerData(apiEndpoint);
                    gifs = await customizeGifObject(gifs.data);
                    gifs.map(gif => gif['category'] = category);
                    await this.addGifsToDB('category-gifs', gifs);
                    resolve(gifs);
                } else {
                    const gifs = await this.getDataFromDB('category-gifs');
                    resolve(gifs);
                }
            } catch (error) {
                logErrorMsg(error, `getGifsByCategoryName`);
                return reject(error.stack);
            }
        });
    }

    /**
     *
     * @description Get a gif for query
     * @author Istiaque Siddiqi
     */
    static getGifsByQuery(query) {
        return new Promise(async (resolve, reject) => {
            let gifs;
            try {
                const apiEndpoint = `${DBHelper.API_BASE_URL}/search?api_key=${DBHelper.API_KEY}&q=${query}&limit=25&offset=0&rating=G&lang=en`;
                gifs = await DBHelper.getServerData(apiEndpoint);
                gifs = await customizeGifObject(gifs.data);
                return resolve(gifs);
            } catch (error) {
                logErrorMsg(error, `getGifsByQuery`);
                return reject(error.stack);
            }
        });
    }

    /**
     * @description Toogle favorite
     * @param {string} name - Name of object store
     * @param {number} id - id of gif
     * @returns Promise
     * @author C Dharmateja
     */
    static toggleFavorite(name, id) {
        return new Promise( async (resolve, reject) => {
            try {
                const db = await this.createDB();
                const tx = db.transaction(name, 'readwrite');
                const store = tx.objectStore(name);
                const gif = await store.get(id);
                gif['isFavorite'] = !gif['isFavorite'];
                await store.put(gif);
                if (gif['isFavorite']) {
                    await this.addGifToDB('favorite-gifs', gif);
                } else {
                    await this.deleteGifFromDB('favorite-gifs', gif);
                }
                resolve('Succesfully toggled');
            } catch(error) {
                logErrorMsg(error, `toggleFavorite`);
                reject(error.stack);
            }
        })
    }

    /**
     * @description Return boolean indicating if a gif is favorite or not
     * @param {number} id - id of gif
     * @returns Promise
     * @author C Dharmateja
     */
    static isItFavorite(id) {
        return new Promise(async (resolve, reject) => {
            try {
                const db = await this.createDB();
                const tx = db.transaction('favorite-gifs');
                const store = tx.objectStore('favorite-gifs');
                const gif = await store.get(id);
                if (gif === undefined) {
                    resolve(false);
                }
                else if (gif.isFavorite) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            } catch(error) {
                logErrorMsg(error, 'isItFavorite');
                reject(error.stack);
            }
        })
    }

}

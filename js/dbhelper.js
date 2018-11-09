
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
            let response;
            try {
                const apiEndpoint = `${DBHelper.API_BASE_URL}/trending?api_key=${DBHelper.API_KEY}&limit=25&rating=G`;
                response = await DBHelper.getServerData(apiEndpoint);
                return resolve(response);
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
                const apiEndpoint = `${DBHelper.API_BASE_URL}/search?api_key=${DBHelper.API_KEY}&q=${category}&limit=25&offset=0&rating=G&lang=en`;
                response = await DBHelper.getServerData(apiEndpoint);
                return resolve(response);
            } catch (error) {
                logErrorMsg(error, `getGifsByCategoryName`);
                return reject(error.stack);
            }
        });
    }

}

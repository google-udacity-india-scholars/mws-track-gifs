
/**
 * @description Common database helper functions.
 */
class DBHelper {

    /**
     * Get your API KEY from https://giphy.com/
     */
    static API_KEY() {
        // add api key
        const apiKey = `YOUR_API_KEY`;
        return apiKey;
    }

    /**
     * API Base URL.
     */
    static API_BASE_URL() {
        return `https://api.giphy.com/v1/gifs`;
    }

    /**
     * @description Fetch data from network.
     * This is a common method used for all network calls
     * @author Istiaque Siddiqi
     */
    static getServerData() {
        return new Promise( async (resolve, reject) => {
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
        return new Promise( async (resolve, reject) => {
            let response;
            try {
                const apiEndpoint = `${DBHelper.API_BASE_URL}/trending?api_key=${DBHelper.API_KEY}&limit=25&rating=G`;
                response = await DBHelper.getServerData(apiEndpoint);
                return resolve(response);
            } catch(error) {
                logErrorMsg(error, `getTrendingGifs`);
                return reject(error.stack);
            }
        });
    }

}
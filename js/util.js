
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
 export const logErrorMsg = (error, methodName) => {
    console.log(`%c*********************** ERROR | ${Date()} | Method: ${methodName} ***********************`, 'color: white; background-color: red; padding: 4px');
    console.log(error.message);
    console.trace();
    console.log(`%c****************************************************************** END ******************************************************************`, 'color: white; background-color: red; padding: 4px');
 }
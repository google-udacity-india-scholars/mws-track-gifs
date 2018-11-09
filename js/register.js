/**
 *
 * @description Register a Service worker
 * @author Sourya
 */
if ('serviceWorker' in navigator) {
  navigator.serviceWorker
  .register('/service-worker.js',{scope: "/"})
    .then(register => {
      console.log("Service Worker is registerd successfully.");
    })
    .catch(error => {
      console.log("Service Worker failed to register::Error: ",error);
    });
}

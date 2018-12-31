// Register service worker
/*if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').then(function () {
        console.log('Service Worker Registered');
    });
}

*/

if ('serviceWorker' in navigator) {
    // Register the service worker
    navigator.serviceWorker.register('sw.js').then(reg => {
        console.log('ServiceWorker registration successful with scope: ', reg.scope);
        reg.addEventListener('updatefound', () => {

            // An updated service worker has appeared in reg.installing!
            newWorker = reg.installing;

            newWorker.addEventListener('statechange', () => {

                // Has service worker state changed?
                switch (newWorker.state) {
                    case 'installed':

                        // There is a new service worker available, show the notification
                        if (navigator.serviceWorker.controller) {
                            let notification = document.getElementById('notification ');
                            notification.className = 'show';
                        }

                        break;
                }
            });
        });
        let refreshing;
        // The event listener that is fired when the service worker updates
        // Here we reload the page
        navigator.serviceWorker.addEventListener('controllerchange', function () {
            if (refreshing) return;
            window.location.reload();
            refreshing = true;
        });
    }).catch(function (err) {
        // registration failed :(
        console.log('ServiceWorker registration failed: ', err);
    });;

}



let newWorker;
// The click event on the notification
document.getElementById('update-button').addEventListener('click', function () {
    newWorker.postMessage({ action: 'skipWaiting' });
});





// Code to handle install prompt on desktop

let deferredPrompt;
const addBtn = document.getElementById('install-button');

window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    e.preventDefault();
    // Stash the event so it can be triggered later.
    deferredPrompt = e;
    // Update UI to notify the user they can add to home screen
    addBtn.style.display = 'block';

    addBtn.addEventListener('click', (e) => {
        // hide our user interface that shows our A2HS button
        addBtn.style.display = 'none';
        // Show the prompt
        deferredPrompt.prompt();
        // Wait for the user to respond to the prompt
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('User accepted the A2HS prompt');
            } else {
                console.log('User dismissed the A2HS prompt');
            }
            deferredPrompt = null;
        });
    });
});
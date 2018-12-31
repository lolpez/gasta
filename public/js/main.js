let newWorker;
function showUpdateBar() {
    M.toast({ html: 'A new version is available!' })
}
// The click event on the pop up notification
document.getElementById('update-button').addEventListener('click', function () {
    console.log("EEEE");
    newWorker.postMessage({ action: 'skipWaiting' });
});
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').then(reg => {
        reg.addEventListener('updatefound', () => {
            // A wild service worker has appeared in reg.installing!
            newWorker = reg.installing;
            newWorker.addEventListener('statechange', () => {
                // Has network.state changed?
                switch (newWorker.state) {
                    case 'installed':
                        if (navigator.serviceWorker.controller) {
                            // new update available
                            showUpdateBar();
                        }
                        // No update available
                        break;
                }
            });
        });
    });
    let refreshing;
    navigator.serviceWorker.addEventListener('controllerchange', function () {
        if (refreshing) return;
        window.location.reload();
        refreshing = true;
    });
}



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
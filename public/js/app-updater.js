let deferredInstaller;
let updateButtons = document.getElementsByClassName("update-button");

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').then(reg => {
        reg.addEventListener('updatefound', () => {
            deferredInstaller = reg.installing;
            deferredInstaller.addEventListener('statechange', () => {
                switch (deferredInstaller.state) {
                    case 'installed':
                        if (navigator.serviceWorker.controller) {
                            for (var i = 0; i < updateButtons.length; i++) {
                                updateButtons[i].addEventListener('click', function () {
                                    deferredInstaller.postMessage({ action: 'skipWaiting' });
                                }, false).classList.remove("disabled");
                            }
                            M.toast({ html: 'A new version is available!' });
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
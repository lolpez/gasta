let deferredInstaller;
const updateBtn = document.getElementById('update-button');

updateBtn.addEventListener('click', () => {
    deferredInstaller.postMessage({ action: 'skipWaiting' });
});

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').then(reg => {
        reg.addEventListener('updatefound', () => {
            deferredInstaller = reg.installing;
            deferredInstaller.addEventListener('statechange', () => {
                switch (deferredInstaller.state) {
                    case 'installed':
                        if (navigator.serviceWorker.controller) {
                            M.toast({ html: 'A new version is available!' });
                            updateBtn.style.display = 'block';
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
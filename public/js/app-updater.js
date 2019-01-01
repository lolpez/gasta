let deferredInstaller;
let updateButtons = document.getElementsByClassName("update-button");

function updateApp() {
    deferredInstaller.postMessage({ action: 'skipWaiting' });
}

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').then(reg => {
        reg.addEventListener('updatefound', () => {
            deferredInstaller = reg.installing;
            deferredInstaller.addEventListener('statechange', () => {
                switch (deferredInstaller.state) {
                    case 'installed':
                        if (navigator.serviceWorker.controller) {
                            for (var i = 0; i < updateButtons.length; i++) {
                                updateButtons[i].classList.remove("disabled");
                                updateButtons[i].addEventListener('click', updateApp, false);
                            }
                            M.toast({
                                html: `A new version is available! <a href='javascript:void(0);' onclick='updateApp()' class='btn-flat toast-action'>Click here to update</a>`,
                                displayLength: 10000
                            });
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
let deferredPrompt;
let installButtons = document.getElementsByClassName("install-button");

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    for (var i = 0; i < installButtons.length; i++) {
        installButtons[i].addEventListener('click', (e) => {
            installButtons[i].style.display = 'none';
            deferredPrompt.prompt();
            deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    M.toast({ html: 'App installed on your device!' });
                } else {
                    M.toast({ html: 'You can install the app later by clicking the download button.' });
                }
                deferredPrompt = null;
            }).classList.remove("disabled");
        });
    }
});
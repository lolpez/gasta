let deferredPrompt;
let installButtons = document.getElementsByClassName("install-button");

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    for (var i = 0; i < installButtons.length; i++) {
        installButtons[i].classList.remove("disabled");
        installButtons[i].addEventListener('click', (e) => {
            deferredPrompt.prompt();
            deferredPrompt.userChoice.then((choiceResult) => {
                console.log(choiceResult.outcome);
                if (choiceResult.outcome === 'accepted') {
                    M.toast({ html: 'Installing app!' });
                } else {
                    M.toast({ html: 'You can install the app later by clicking the download button.' });
                }
                deferredPrompt = null;
            })
        });
    }
});
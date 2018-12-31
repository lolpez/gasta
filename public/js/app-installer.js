let deferredPrompt;
const addBtn = document.getElementById('install-button');

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    addBtn.style.display = 'block';
    addBtn.addEventListener('click', (e) => {
        addBtn.style.display = 'none';
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                M.toast({ html: 'App installed on your device!' });
            } else {
                M.toast({ html: 'You can install the app later by clicking the download button.' });
            }
            deferredPrompt = null;
        });
    });
});
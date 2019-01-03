// window.onload = function () {
var app = {
    socket: io("/index"),
    dataBase: new Nedb({
        filename: 'gasta-db.db',
        autoload: true
    }),
    deferredUpdater: null,
    eleLoader: document.getElementById('loader'),
    eleTopMenu: document.getElementById('top-menu'),
    eleContent: document.getElementById('content'),
    //eleModals: document.querySelectorAll('.modal'),
    eleNavs: document.querySelectorAll('.sidenav'),
    eleFloatingButton: document.getElementById('floating-button'),
    eleTooltips: document.querySelectorAll('.tooltipped'),
    eleTabs: document.querySelectorAll('.tabs'),
    eleSelects: document.querySelectorAll('select'),
    eleSubmitButton: document.getElementById('submit-button'),
    eleQuantityInput: document.getElementById("money-to-spend"),
    eleCategoryInput: document.getElementById("category-spent"),
    eleDescriptionInput: document.getElementById("spend-description"),
    eleMagicButtons: document.querySelectorAll('.magic-button'),
    eleTodayTotalSpent: document.getElementById("spent-number"),
    eleUpdateButtons: document.getElementsByClassName("update-button"),
    eleInstallButtons: document.getElementsByClassName("install-button"),
    init: () => {
        app.initUI();
        //app.initDataBase();
        app.initSocket();
        //app.initServiceWorker();
        app.newExpense(10, "Miguel", "lopez", new Date());
    },
    initUI: () => {
        ///M.Modal.init(modals);
        M.Sidenav.init(app.eleNavs, {});
        M.Tabs.init(app.eleTabs);
        M.FloatingActionButton.init(app.eleFloatingButton);
        M.Tooltip.init(app.eleTooltips);
        M.FormSelect.init(app.eleSelects);
        app.eleMagicButtons.forEach(magicButton => magicButton.addEventListener("click", function () {
            app.newExpense(
                this.dataset.quantity,
                this.dataset.category,
                this.dataset.description,
                new Date()
            );
        }));
        app.eleSubmitButton.addEventListener('click', () => {
            app.newExpense(
                app.eleQuantityInput.value,
                app.eleCategoryInput.value,
                app.eleDescriptionInput.value,
                new Date()
            );
        });
        app.eleLoader.style.display = 'none';
        app.eleTopMenu.style.display = 'block';
        app.eleContent.style.display = 'block';
    },
    initDataBase: () => {
        app.dataBase.findOne({ _id: '123' }, function (err, doc) {
            if (doc) {
                //if the user total spent exits, then show it and try to refresh it from server
                console.log(doc)
            } else {
                //if the user total spent does not exits, then create a new one
                app.dataBase.insert({ _id: '123', total: 123.50 }, function (err) {
                    if (err) {
                        alert(err)
                    } else {
                        app.dataBase.findOne({ _id: '123' }, function (err, doc) {
                            console.log(doc)
                        });
                    }
                });
            }
        });
    },
    initSocket: () => {
        app.socket.on('connect', function () {
            var today = new Date();
            app.socket.emit('get-from-dates', {
                startDate: `${today.getFullYear()}-${checkZero(today.getMonth() + 1)}-${checkZero(today.getDate())}T00:00:00.000Z`,
                endDate: `${today.getFullYear()}-${checkZero(today.getMonth() + 1)}-${checkZero(today.getDate())}T23:59:59.999Z`
            });
            function checkZero(i) {
                if (i < 10) i = `0${i}`;
                return i;
            }
        });

        app.socket.on('disconnect', function () {
            app.socket.sendBuffer = [];
            console.log('Offline mode activated');
        });

        app.socket.on('user-connected', (response) => {
            //get updates from server
            console.log(response);
        });

        app.socket.on('ggggg', (response) => {
            console.log(response);
            /*if (!response.success) {
                M.toast({ html: "Error, could not registered new expense." });
                return;
            }
            todayTotalSpent.innerHTML = response.total;
            quantityInput.value = '';
            categoryInput.value = '';
            descriptionInput.value = '';
            M.updateTextFields();
            M.toast({ html: response.message, displayLength: 1000 });*/
        });
    },
    initServiceWorker: () => {
        let deferredPrompt;
        let installEventButtons = false;
        let refreshEvent;

        function addInstallEventToButtons() {
            for (var i = 0; i < app.eleInstallButtons.length; i++) {
                app.eleInstallButtons[i].classList.remove("disabled");
                app.eleInstallButtons[i].dataset.tooltip = 'Install app';
                app.eleInstallButtons[i].addEventListener('click', (e) => {
                    deferredPrompt.prompt();
                    deferredPrompt.userChoice.then((choiceResult) => {
                        if (choiceResult.outcome === 'accepted') {
                            M.toast({ html: 'Installing app!' });
                        } else {
                            M.toast({ html: 'You can install the app later by clicking the download button.' });
                        }
                        deferredPrompt = null;
                    })
                });
            }
        }

        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('sw.js').then(reg => {
                reg.addEventListener('updatefound', () => {
                    app.deferredUpdater = reg.installing;
                    app.deferredUpdater.addEventListener('statechange', () => {
                        switch (app.deferredUpdater.state) {
                            case 'installed':
                                if (navigator.serviceWorker.controller) {
                                    for (var i = 0; i < app.eleUpdateButtons.length; i++) {
                                        app.eleUpdateButtons[i].classList.remove("disabled");
                                        app.eleUpdateButtons[i].dataset.tooltip = 'Update available';
                                        app.eleUpdateButtons[i].addEventListener('click', app.updateApp, false);
                                    }
                                    M.toast({
                                        html: `A new version is available! <a href='javascript:void(0);' onclick='app.updateApp()' class='btn-flat toast-action'>Update</a>`,
                                        displayLength: 10000
                                    });
                                }
                                // No update available
                                break;
                        }
                    });
                });
                console.log("Service Worker Registered", reg.scope);
            }).catch(function (err) {
                console.log("Service Worker Failed to Register", err);
            });
            navigator.serviceWorker.addEventListener('controllerchange', function () {
                if (refreshEvent) return;
                window.location.reload();
                refreshEvent = true;
            });
        }

        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;
            if (!installEventButtons) {
                addInstallEventToButtons();
                installEventButtons = true;
            }
        });
    },
    updateApp: () => {
        app.deferredUpdater.postMessage({ action: 'skipWaiting' });
    },
    newExpense: (quantity, category, description, date) => {
        app.socket.emit('client-new-expense', {
            date: date.toISOString(),
            quantity: parseInt(quantity),
            category: category,
            description: description
        });
    },
    getFromDates: (startDate, endDate) => {
        app.socket.emit('client-get-expenses-from-dates', {
            startDate: startDate,
            endDate: endDate
        });
    }
}

app.init();
// }
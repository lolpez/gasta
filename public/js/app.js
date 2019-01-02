var app = {
    socket: io("/index"),
    dataBase: new Nedb({
        filename: 'gasta-db.db',
        autoload: true
    }),
    init: () => {
        app.initSocket();
        //app.initDataBase();
    },
    initSocket: () => {
        app.socket.on('connect', function () {
            var today = new Date();
            console.log('Connected');
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
            console.log(response);
        });

        app.socket.on('ggggg', (response) => {
            console.log(response);
        });
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
    newExpense: (quantity, category, description) => {
        var today = new Date();
        app.socket.emit('client-new-expense', {
            date: today.toISOString(),
            quantity: parseInt(quantity),
            category: category,
            description: description
        });
    }
}
app.init();
app.newExpense(0.0, "GG", "WP");
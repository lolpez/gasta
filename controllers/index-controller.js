var modelExpense = require('../models/expense');
var businessExpense = require('../business/expense');
/**
 * @constructor
 * @param {SocketIO} io - Socket IO room for index router.
 * @version 1.0
 * @namespace
 * @class indexController
 */
var indexController = (io) => {
    var pages = {
        /* GET home page. */
        mainPage: (req, res, next) => {
            res.render("index", {
                title: "Gasta",
                version: "0.0.1",
            });
        }
    }
    /**
     * Socket io listener for insert/update/delete functions.
     * @function io
     * @param {SocketIO} socket - Socket connected.
     * @memberof indexController
     */
    io.on('connection', (socket) => {
        io.to(socket.id).emit('user-connected', {
            success: true,
            message: `User ${socket.id} connected successfully`
        });
		/**
		 * Socket listener for insert events.
		 * @function socket-onInsert
		 * @param {object} data - Data recieved for person insertion.
		 * @property {string} data.name - Person's name.
		 * @property {string} data.lastName - Person's paternal and maternal last name.
		 * @property {Date} data.birthday - Person's birth date.
		 * @memberof indexController
		 */
        socket.on('new-expense', (data) => {
            modelExpense.insert(data).then((expense) => {
                modelExpense.getTodaySpent().then((todayExpenses) => {
                    io.to(socket.id).emit('expense-inserted', {
                        success: true,
                        message: `Bs. ${expense.quantity} spent in ${expense.category}`,
                        total: todayExpenses.total
                    });
                });
            });
        });

        socket.on('get-from-dates', (data) => {
            modelExpense.getTotalFromDateRange(data.startDate, data.endDate).then((todayExpenses) => {
                io.to(socket.id).emit('ggggg', todayExpenses);
            });
        });

        socket.on('client-new-expense', (data) => {
            businessExpense.newExpense(
                data.date,
                data.quantity,
                data.category,
                data.description
            ).then((expense) => {
                io.to(socket.id).emit('server-expense-inserted', {
                    success: true,
                    message: `Bs. ${expense.quantity} spent in ${expense.category}`
                });
            });
        });

        socket.on('client-get-expenses-from-dates', (data) => {
            businessExpense.getExpensesFromDates(
                data.startDate,
                data.endDate
            ).then((result) => {
                io.to(socket.id).emit('server-expenses-from-dates', {
                    total: result.total
                });
            });
        });
    });
    return pages;
}

module.exports = indexController;
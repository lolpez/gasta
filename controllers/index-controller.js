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
                title: "GGGG",
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
        businessExpense.getExpensesFromDates(
            socket.handshake.query.startDate,
            socket.handshake.query.endDate
        ).then((result) => {
            io.to(socket.id).emit('server-user-connected', {
                success: true,
                message: `User ${socket.id} connected successfully.`,
                totalSpent: (result) ? result.total : 0
            });
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
                    totalSpent: (result) ? result.total : 0
                });
            });
        });
    });
    return pages;
}

module.exports = indexController;
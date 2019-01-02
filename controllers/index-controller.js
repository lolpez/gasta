var modelExpense = require('../models/expense');
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
            modelExpense.getTodaySpent().then((todayExpenses) => {
                res.render("index", {
                    title: "Gasta",
                    version: "0.0.1",
                    total: todayExpenses.total
                });
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
                    io.emit('expense-inserted', {
                        success: true,
                        message: `Bs. ${expense.quantity} spent in ${expense.category}`,
                        total: todayExpenses.total
                    });
                });
            });
        });
    });
    return pages;
}

module.exports = indexController;
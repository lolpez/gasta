var modelPerson = require('../models/person');
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
                version: "0.0.1"
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
        console.log(socket.id + "connected")
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
            modelPerson.insert(data).then((expense) => {
                io.emit('expense-inserted', {
                    success: true,
                    message: `Bs. ${expense.cuantity} spent in ${expense.category}`,
                    object: null
                });
            });
        });
    });
    return pages;
}

module.exports = indexController;
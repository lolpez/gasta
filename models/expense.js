var assert = require('assert');
var mongodb = require('mongodb');
const con = require("./connection"),
    collectionName = "expense";

/**
 * @constructor
 * @namespace expenseModel
 * @version 1.0
 * @property {function} select - Router handler for GET method of /expense URL.
 * @property {function} insert - Router handler for POST method of /expense URL.
 * @property {function} update - SocketIo event for connections to expense room.
 * @property {function} remove - SocketIo event for connections to expense room.
 * @class expense
 * <br>A expense object contains:<br>&nbsp&nbsp
 * 
 * {string} id - expense`s identification key (optional)<br>&nbsp&nbsp
 * 
 * {string} name - expense's name <br>&nbsp&nbsp
 * 
 * {string} lastName - expense's last name <br>&nbsp&nbsp
 * 
 * {Date} birthday - expense's birth date <br>&nbsp&nbsp
 */

var model = {
    /**
     * Query selection for expense collection. Returns an array of selected documents
     * @method select
     * @param {object} data - Query filters. 
     * @returns {array} 
     * @memberof expenseModel
     */
    select: (data = {}) => {
        if (data.id) {
            data._id = new mongodb.ObjectID(data.id)
            delete data.id;
        }
        return new Promise((resolve, reject) => {
            con.then((db) => {
                const collection = db.collection(collectionName);
                collection.find(data).toArray((err, docs) => {
                    assert.equal(err, null);
                    resolve(docs);
                });
            });
        });
    },
    /**
     * Query selection for expense collection. Returns an array of selected documents
     * @method select
     * @param {object} data - Query filters. 
     * @returns {array} 
     * @memberof expenseModel
     */
    selectOne: (data) => {
        return new Promise((resolve, reject) => {
            con.then((db) => {
                const collection = db.collection(collectionName);
                collection.findOne(data).then((doc) => {
                    resolve(doc)
                })
            });
        });
    },
    /**
     * Insert query to for a expense document. Returns inserted document.
     * @method insert
     * @param {object} data - Query filters.
     * @returns {object} 
     * @property {string} data.name - expense's name.
     * @property {string} data.lastName - expense's paternal and maternal last name.
     * @property {Date} data.birthday - expense's birth date.
     * @memberof expenseModel
     */
    insert: (data) => {
        return new Promise((resolve, reject) => {
            con.then((db) => {
                const collection = db.collection(collectionName);
                collection.insertOne(data, (err, result) => {
                    assert.equal(err, null);
                    assert.equal(1, result.result.n);
                    assert.equal(1, result.ops.length);
                    resolve(result.ops[0]);
                });
            });
        });
    },
    /**
     * Update query to for a expense document. Returns updated document.
     * @method update
     * @param {object} data - Query filters.
     * @returns {object} 
     * @property {string} data.id - expense's ID to update.
     * @property {string} data.name - New expense's name to replace.
     * @property {string} data.lastName - New expense's paternal and maternal last name to replace.
     * @property {Date} data.birthday - New expense's birth date to replace.
     * @memberof expenseModel
    */
    update: (data) => {
        return new Promise((resolve, reject) => {
            con.then((db) => {
                const collection = db.collection(collectionName);
                collection.findOneAndUpdate({ _id: new mongodb.ObjectID(data.id) }, { $set: data }, function (err, docs) {
                    model.select({ id: data.id }).then((doc) => {
                        resolve(doc[0])
                    })
                });
            });
        });
    },
    /**
     * Update query to for a expense document. Returns updated document.
     * @method update
     * @param {object} data - Query filters.
     * @returns {object} 
     * @property {string} data.id - expense's ID to update.
     * @property {string} data.name - New expense's name to replace.
     * @property {string} data.lastName - New expense's paternal and maternal last name to replace.
     * @property {Date} data.birthday - New expense's birth date to replace.
     * @memberof expenseModel
    */
    push: (data) => {
        return new Promise((resolve, reject) => {
            con.then((db) => {
                const collection = db.collection(collectionName);
                collection.findOneAndUpdate(
                    { _id: mongodb.ObjectID(data.id) },
                    { $push: { details: data.object } },
                    { returnOriginal: false },
                ).then((doc) => {
                    resolve(doc.value)
                });
            });
        });
    },
    /**
     * Update query to for a expense document. Returns updated document.
     * @method update
     * @param {object} data - Query filters.
     * @returns {object} 
     * @property {string} data.id - expense's ID to update.
     * @property {string} data.name - New expense's name to replace.
     * @property {string} data.lastName - New expense's paternal and maternal last name to replace.
     * @property {Date} data.birthday - New expense's birth date to replace.
     * @memberof expenseModel
    */
    setToExpenseDetail: (data) => {
        return new Promise((resolve, reject) => {
            con.then((db) => {
                const collection = db.collection(collectionName);
                collection.findOneAndUpdate(
                    { _id: mongodb.ObjectID(data.id) },
                    { $set: data.object },
                    { returnOriginal: false },
                ).then((doc) => {
                    resolve(doc.value.details[data.expenseId]);
                });
            });
        });
    },
    /**
     * Update query to for a expense document. Returns updated document.
     * @method update
     * @param {object} data - Query filters.
     * @returns {object} 
     * @property {string} data.id - expense's ID to update.
     * @property {string} data.name - New expense's name to replace.
     * @property {string} data.lastName - New expense's paternal and maternal last name to replace.
     * @property {Date} data.birthday - New expense's birth date to replace.
     * @memberof expenseModel
    */
    getExpensesFromDates: (data) => {
        return new Promise((resolve, reject) => {
            con.then((db) => {
                const collection = db.collection(collectionName);
                collection.aggregate([
                    {
                        $match: {
                            date: {
                                $gte: data.startDate,
                                $lt: data.endDate
                            }
                        }
                    },
                    {
                        $unwind: "$details"
                    },
                    {
                        $group: {
                            _id: null,
                            total: { $sum: "$details.quantity" }
                        }
                    }
                ]).toArray((err, docs) => {
                    resolve(docs)
                });
            });
        });
    },
    /**
     * Remove query to for a expense document. Returns document ID to confirm removing.
     * @method remove
     * @param {string} id - expense's ID document to remove.
     * @returns {string}
     * @memberof expenseModel
     */
    remove: (id) => {
        return new Promise((resolve, reject) => {
            con.then((db) => {
                const collection = db.collection(collectionName);
                collection.deleteOne({ _id: new mongodb.ObjectID(id) }, (err, result) => {
                    assert.equal(err, null);
                    assert.equal(1, result.result.n);
                    resolve(id);
                });
            });
        });
    },
    /**
     * Gets the user´s today spent.
     * @method remove
     * @param {string} id - expense's ID document to remove.
     * @returns {string}
     * @memberof expenseModel
     */
    getTodaySpent: (id) => {
        return new Promise((resolve, reject) => {
            con.then((db) => {
                const collection = db.collection(collectionName);
                collection.aggregate([
                    {
                        $group: {
                            _id: null,
                            total: { $sum: "$quantity" },
                            count: { $sum: 1 }
                        }
                    }
                ]).toArray((err, docs) => {
                    assert.equal(err, null);
                    resolve(docs[0]);
                });
            });
        });
    },
    getTotalFromDateRange: (startDate, endDate) => {
        return new Promise((resolve, reject) => {
            con.then((db) => {
                const collection = db.collection(collectionName);
                collection.aggregate([
                    {
                        $match: {
                            date: {
                                $gte: startDate,
                                $lt: endDate
                            }
                        }
                    },
                    {
                        $group: {
                            _id: null,
                            total: { $sum: "$quantity" }
                        }
                    }
                ]).toArray((err, docs) => {
                    assert.equal(err, null);
                    resolve(docs[0]);
                });
            });
        });
    }
}

module.exports = model;
var modelExpense = require('../models/expense');
var mongodb = require('mongodb');

var model = {
    newExpense: (date, quantity, category, description) => {
        return new Promise((resolve, reject) => {
            modelExpense.selectOne({ date: new Date(`${date.split("T")[0]}T00:00:00.000Z`) }).then((doc) => {
                if (doc) {
                    modelExpense.push({
                        id: doc._id,
                        object: {
                            _id: new mongodb.ObjectID(),
                            date: new Date(date),
                            quantity: quantity,
                            category: category,
                            description: description
                        }
                    }).then((doc) => {
                        resolve(doc);
                    });
                } else {
                    modelExpense.insert({
                        date: new Date(`${date.split("T")[0]}T00:00:00.000Z`),
                        details: [
                            {
                                _id: new mongodb.ObjectID(),
                                date: new Date(date),
                                quantity: quantity,
                                category: category,
                                description: description
                            }
                        ]
                    }).then((doc) => {
                        resolve(doc)
                    })
                }
            })
        });
    },
    getExpensesFromDates: (startDate, endDate) => {
        return new Promise((resolve, reject) => {
            modelExpense.getExpensesFromDates({
                startDate: new Date(startDate),
                endDate: new Date(endDate)
            }).then((doc) => {
                resolve(doc)
            })
        });
    },
}

module.exports = model;
var modelExpense = require('../models/expense');
var mongodb = require('mongodb');

var model = {
    newExpense: (date, quantity, category, description) => {
        return new Promise((resolve, reject) => {
            modelExpense.selectOne({ date: date.split("T")[0] }).then((doc) => {
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
                        console.log("THIS IS IT")
                        resolve(doc)
                    })
                } else {
                    modelExpense.insert({
                        date: date.split("T")[0],
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
    }
}

module.exports = model;
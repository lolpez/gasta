var modelExpense = require("../models/expense");
var mongodb = require("mongodb");

var model = {
	newExpense: (date, quantity, category, description) => {
		return new Promise((resolve, reject) => {
			modelExpense.selectOne({ date: new Date(`${date.split("T")[0]}T00:00:00.000Z`) }).then((doc) => {
				var id = new mongodb.ObjectID();
				if (doc) {
					var newDetail = {};
					newDetail["details." + id.toString()] = {
						_id: id,
						date: new Date(date),
						quantity: quantity,
						category: category,
						description: description
					};
					modelExpense.setToExpenseDetail({
						id: doc._id,
						object: newDetail,
						expenseId: id
					}).then((doc) => {
						resolve(doc);
					});
				} else {
					var details = {};
					details[id.toString()] = {
						_id: id,
						date: new Date(date),
						quantity: quantity,
						category: category,
						description: description
					};
					modelExpense.insert({
						date: new Date(`${date.split("T")[0]}T00:00:00.000Z`),
						details: details
					}).then((doc) => {
						resolve(doc.details[id.toString()]);
					});
				}
			});
		});
	},
	getExpensesFromDates: (startDate, endDate) => {
		return new Promise((resolve, reject) => {
			modelExpense.getExpensesFromDates({
				startDate: new Date(startDate),
				endDate: new Date(endDate)
			}).then((doc) => {
				resolve(doc);
			});
		});
	}
};

module.exports = model;

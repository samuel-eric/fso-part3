const mongoose = require('mongoose');

mongoose.set('strictQuery', false);

const url = process.env.MONGODB_URI;
mongoose
	.connect(url)
	.then(() => console.log('connected to database'))
	.catch((error) =>
		console.log('error connection to database: ', error.message)
	);

const personSchema = new mongoose.Schema({
	name: {
		type: String,
		minLength: 3,
		required: true,
	},
	number: {
		type: String,
		minLength: 8,
		validate: {
			validator: (value) => {
				const numberArr = value.split('-');
				if (
					!isNaN(numberArr[0]) &&
					!isNaN(numberArr[1]) &&
					numberArr.length === 2 &&
					numberArr[0].length >= 2 &&
					numberArr[0].length <= 3
				) {
					return true;
				}
				return false;
			},
		},
	},
});

personSchema.set('toJSON', {
	transform: (document, returnedObj) => {
		returnedObj.id = returnedObj._id.toString();
		delete returnedObj._id;
		delete returnedObj.__v;
	},
});

module.exports = mongoose.model('person', personSchema);

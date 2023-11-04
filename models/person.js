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
	name: String,
	number: String,
});

personSchema.set('toJSON', {
	transform: (document, returnedObj) => {
		returnedObj.id = returnedObj._id.toString();
		delete returnedObj._id;
		delete returnedObj.__v;
	},
});

module.exports = mongoose.model('person', personSchema);

const mongoose = require('mongoose');

if (process.argv[2] === undefined) {
	console.log('give password as argument');
	process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://fullstack:${password}@phonebook.xl6lxv5.mongodb.net/phonebook?retryWrites=true&w=majority`;

mongoose.set('strictQuery', false);
mongoose.connect(url);

const personSchema = new mongoose.Schema({
	name: String,
	number: String,
});

const Person = mongoose.model('Person', personSchema);

const name = process.argv[3];
const number = process.argv[4];

if (name && number) {
	const newPerson = new Person({
		name,
		number,
	});
	newPerson.save().then((result) => {
		console.log(`Added ${name} ${number} to phonebook`);
		mongoose.connection.close();
	});
} else {
	Person.find({}).then((result) => {
		console.log('phonebook:');
		result.forEach((person) => console.log(`${person.name} ${person.number}`));
		mongoose.connection.close();
	});
}

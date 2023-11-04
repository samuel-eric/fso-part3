require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/person');
const app = express();

morgan.token('data', (request, response) => JSON.stringify(request.body));

app.use(express.static('dist'));
app.use(express.json());
app.use(
	morgan(':method :url :status :res[content-length] - :response-time ms :data')
);
app.use(cors());

let persons = [
	{
		id: 1,
		name: 'Arto Hellas',
		number: '040-123456',
	},
	{
		id: 2,
		name: 'Ada Lovelace',
		number: '39-44-5323523',
	},
	{
		id: 3,
		name: 'Dan Abramov',
		number: '12-43-234345',
	},
	{
		id: 4,
		name: 'Mary Poppendieck',
		number: '39-23-6423122',
	},
];

app.get('/api/persons', (request, response, next) => {
	Person.find({}).then((result) => response.json(result));
});

app.get('/info', (request, response) => {
	Person.find({}).then((persons) => {
		response.send(
			`<p>Phonebook has info for ${persons.length} people</p>
			<p>${new Date().toString()}</p>`
		);
	});
});

app.get('/api/persons/:id', (request, response, next) => {
	Person.findById(request.params.id)
		.then((foundPerson) => {
			if (foundPerson) {
				response.json(foundPerson);
			} else {
				response.status(404).end();
			}
		})
		.catch((error) => next(error));
});

app.delete('/api/persons/:id', (request, response, next) => {
	Person.findByIdAndDelete(request.params.id)
		.then((result) => response.status(204).end())
		.catch((error) => next(error));
});

const generateId = () => Math.floor(Math.random() * 100000000);

app.post('/api/persons', (request, response) => {
	const { name, number } = request.body;
	if (name && number) {
		return response.status(400).json({
			error: 'missing required data',
		});
	}
	const person = new Person({
		name,
		number,
	});
	person.save().then((returnedPerson) => response.json(returnedPerson));
});

app.put('/api/persons/:id', (request, response) => {
	const { name, number } = request.body;
	const person = {
		name,
		number,
	};
	Person.findByIdAndUpdate(request.params.id, person, { new: true })
		.then((updatedPerson) => response.json(updatedPerson))
		.catch((error) => next(error));
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
	console.log(`server is running on port ${PORT}`);
});

const errorHandler = (error, request, response, next) => {
	console.log(error.message);
	if (error.name === 'CastError') {
		response.status(400).send({ error: 'misformatted id' });
	}
	next(error);
};

app.use(errorHandler);

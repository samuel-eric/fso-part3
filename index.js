const express = require('express');
const app = express();

app.use(express.json());

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

app.get('/api/persons', (request, response) => {
	response.json(persons);
});

app.get('/info', (request, response) => {
	response.send(
		`<p>Phonebook has info for ${persons.length} people</p>
    <p>${new Date().toString()}</p>`
	);
});

app.get('/api/persons/:id', (request, response) => {
	const id = Number(request.params.id);
	const person = persons.find((person) => person.id === id);

	if (person) {
		response.json(person);
	} else {
		response.status(404).end();
	}
});

app.delete('/api/persons/:id', (request, response) => {
	const id = Number(request.params.id);
	persons = persons.filter((person) => person.id !== id);
	response.status(204).end();
});

const generateId = () => Math.floor(Math.random() * 100000000);

app.post('/api/persons', (request, response) => {
	const { name, number } = request.body;
	if (!name && !number) {
		return response.status(400).json({
			error: 'missing required data',
		});
	}
	const duplicateName = persons.find(
		(person) => person.name.toLowerCase() === name.toLowerCase()
	);
	if (duplicateName) {
		return response.status(400).json({
			error: 'name must be unique',
		});
	}
	let id = generateId();
	const duplicateId = persons.find((person) => person.id === id);
	while (duplicateId) {
		id = generateId;
	}
	const person = { id, name, number };
	persons = persons.concat(person);
	response.json(person);
});

const PORT = 3001;
app.listen(PORT, () => {
	console.log(`server is running on port ${PORT}`);
});

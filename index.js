require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
const app = express()

morgan.token('data', (request) => JSON.stringify(request.body))

app.use(express.static('dist'))
app.use(express.json())
app.use(
	morgan(':method :url :status :res[content-length] - :response-time ms :data')
)
app.use(cors())

app.get('/api/persons', (request, response) => {
	Person.find({}).then((result) => response.json(result))
})

app.get('/info', (request, response) => {
	Person.find({}).then((persons) => {
		response.send(
			`<p>Phonebook has info for ${persons.length} people</p>
			<p>${new Date().toString()}</p>`
		)
	})
})

app.get('/api/persons/:id', (request, response, next) => {
	Person.findById(request.params.id)
		.then((foundPerson) => {
			if (foundPerson) {
				response.json(foundPerson)
			} else {
				response.status(404).end()
			}
		})
		.catch((error) => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
	Person.findByIdAndDelete(request.params.id)
		.then(() => response.status(204).end())
		.catch((error) => next(error))
})

app.post('/api/persons', (request, response, next) => {
	const { name, number } = request.body
	if (!name && !number) {
		return response.status(400).json({
			error: 'missing required data',
		})
	}
	const person = new Person({
		name,
		number,
	})
	person
		.save()
		.then((returnedPerson) => response.json(returnedPerson))
		.catch((error) => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
	const { name, number } = request.body
	const person = {
		name,
		number,
	}
	Person.findByIdAndUpdate(request.params.id, person, {
		new: true,
		runValidators: true,
		context: 'query',
	})
		.then((updatedPerson) => response.json(updatedPerson))
		.catch((error) => next(error))
})

// eslint-disable-next-line no-undef
const PORT = process.env.PORT
app.listen(PORT, () => {
	console.log(`server is running on port ${PORT}`)
})

const errorHandler = (error, request, response, next) => {
	console.error(error.message)
	if (error.name === 'CastError') {
		response.status(400).send({ error: 'misformatted id' })
	} else if (error.name === 'ValidationError') {
		response.status(400).send({ error: error.message })
	}
	next(error)
}

app.use(errorHandler)

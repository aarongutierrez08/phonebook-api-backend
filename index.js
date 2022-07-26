const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
require('dotenv').config()
const Person = require('./models/person')
const { response } = require('express')

app.use(express.json())
morgan.token('body', (req) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] :response-time ms :body'))
app.use(cors())
app.use(express.static('build'))

app.get('/', (request, response) => {
    response.send('<h1>PHONEBOOK</h1>')
})
  
app.get('/api/persons', (request, response) => {
  Person.find({})
    .then(persons => {
      response.json(persons)
  })
    .catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
      .then(person => {
        if (person) {
          response.json(person)
        } else {
          response.status(404).end()
        }
      })
      .catch(error => next(error))
})

app.get('/info', async (request, response, next) => {
  const totalPersons = await Person.find({})
                         .then(persons => persons.length)
                         .catch(error => next(error))

  response.send(
      `<p>Phonebook has info for ${totalPersons} people</p>
       <p>${new Date()}</p>`
    )
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons', async (request, response, next) => {
  const body = request.body

  if (!body.name) {
    console.log('name missing')
    return response.status(400).json({ 
      error: 'name missing'
    })
  }
  else if (!body.number) {
    console.log('number missing')
    return response.status(400).json({ 
      error: 'number missing'
    })
  }

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save()
    .then(savedPerson => {
      response.json(savedPerson)
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body
  
  const person = {
    name: body.name,
    number: body.number
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

const errorHandler = (error, request, reponse, next) => {
  console.log(error.mesagge)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}

app.use(errorHandler)

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)
/*
const badObject = (request, response) => {
  response.status(200).send({ error: 'badObject' })
}

app.use(badObject)
*/    

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

app.use(express.json())
morgan.token('body', (req) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] :response-time ms :body'))
app.use(cors())
app.use(express.static('build'))

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456"
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523"
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345"
  },
  {
    id: 4,
    name: "Mar Poppendick",
    number: "39-23-6423122"
  }
]

app.get('/', (request, response) => {
    response.send('<h1>PHONEBOOK</h1>')
})
  
app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
})

app.get('/info', (request, response) => {
    response.send(
      `<p>Phonebook has info for ${persons.length} people</p>
       <p>${new Date()}</p>`
      )
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
})

/*
const generateId = () => {
    const maxId = persons.length > 0
      ? Math.max(...persons.map(n => n.id))
      : 0
    return maxId + 1
  }
*/

function random(min, max) {
    return Math.floor((Math.random() * (max - min + 1)) + min);
}

app.post('/api/persons', (request, response) => {
    const body = request.body
  
    if (!body.name) {
      return response.status(400).json({ 
        error: 'name missing' 
      })
    } else if (persons.find(p => p.name === body.name)) {
      return response.status(400).json({ 
        error: 'name must be unique'
      })
    } else if (!body.number) {
      return response.status(400).json({ 
        error: 'number missing' 
      })
    }

    const person = {
      id: random(4, 1000),
      name: body.name,
      number: body.number
    }
  
    persons = persons.concat(person)
  
    response.json(person)
  })

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
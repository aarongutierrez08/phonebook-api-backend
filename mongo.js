const mongoose = require('mongoose')
require('dotenv').config()
const Person = require('./models/person')

if (process.argv.length == 3 || process.argv.length > 4){
  console.log('Please provide the name and number as arguments: node mongo.js <name> <number>')
  process.exit(1)
}

if (process.argv.length == 2) {
    Person.find({}).then(result => {
        console.log('phonebook:')
        result.forEach(person => {
            console.log(person.name, person.number)
        })
        mongoose.connection.close()
    })
}

const newName = process.argv[2]
const newNumber = process.argv[3]

const newPerson = new Person({
    name: newName,
    number: newNumber
})

if (process.argv.length == 4) {

    newPerson.save()
        .then(result => {
            console.log(result.toJSON())
            console.log(`added ${newName} with number ${newNumber} to phonebook`)
            mongoose.connection.close()
        })
        .catch((error) => {
            console.log({
                message: error._message,
                errors: error.errors
            })
        })
} 


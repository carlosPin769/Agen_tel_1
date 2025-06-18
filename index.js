const express = require('express')
const app = express()


app.use(express.json())
app.use(express.static('dist'))

let agenda =[
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]


const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}
app.use(requestLogger)

app.get('/', (request, response) => {
  response.send('<h1>Adios Que te vas!</h1>')
})

app.get('/api/persons', (request, response) => {
  response.json(agenda)
})

app.get('/api/persons/info',(request, response) => {
	const persLen = agenda.length
	const fecha = new Date().toString()
	const html = `<p>Agenda telefónica tiene informacion de: ${persLen} personas</p><p>  ${fecha} </p>`;
	response.send(html)
})	

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const persona = agenda.find(pers => pers.id === id)
 if (persona) {
    response.json(persona)
  } else {
	response.statusMessage = "Persona no Encontrada";
    response.status(404).end();
  }

})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  agenda = agenda.filter(pers => pers.id !== id)
  response.statusMessage = "Persona Eliminada";
  response.status(204).end()
})

const getRandomInt= (max) => {
  return Math.floor(Math.random() * max);
}

const generateId = () => {
  let losId = agenda.map(per => per.id)
  let nuevoId;
  do {
	  nuevoId = getRandomInt(1000);
  } while (losId.includes(nuevoId));
  return nuevoId
}

const nuevaAgenda = (elId,elNum) =>  agenda.map(contacto => {
  if (contacto.id === elId) {
     return{ ...contacto, number: elNum };
  }
  return contacto;
});


app.put('/api/persons/Modifi/:id', (request, response) => {
	const elId = Number(request.params.id)
	const body = request.body
	
	if (!body.number ) {
    return response.status(400).json({ 
      error: 'Número no introducido' 
    })
  }
  
  const perso = {
    name: body.name,
	number: body.number,
    id: elId
  }
	agenda = nuevaAgenda(perso.id,perso.number)
	response.json(perso)
})


app.post('/api/persons', (request, response) => {
  const losName = agenda.map(per => per.name)
  const body = request.body
  
  if (!body.name ) {
    return response.status(400).json({ 
      error: 'Nombre no introducido' 
    })
  }
  if (!body.number ) {
    return response.status(400).json({ 
      error: 'Número no introducido' 
    })
  }
  
  if (losName.indexOf(body.name) > -1){
    return response.status(400).json({ 
      error: 'Nombre ya Existe' 
    })
  }

  const perso = {
    name: body.name,
	number: body.number,
    id: generateId(),
  }
  
  agenda = agenda.concat(perso)
  response.json(agenda)
})

const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)
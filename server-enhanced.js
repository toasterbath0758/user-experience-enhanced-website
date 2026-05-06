console.log('dit is de opgeschoonde server.js')

import express from 'express'
import { Liquid } from 'liquidjs';

const baseURL = 'https://fdnd-agency.directus.app/items/frankendael_news'

const app = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

const engine = new Liquid();
app.engine('liquid', engine.express());
app.set('views', './views')

app.get('/', async function (request, response) {
   const artikelResponse = await fetch(baseURL)
   const artikelResponseJSON = await artikelResponse.json()
   response.render('index.liquid', { 
     news: artikelResponseJSON.data 
   })
})

app.get('/artikel', async function (request, response) {
   const artikelResponse = await fetch('https://fdnd-agency.directus.app/items/frankendael_news')
   const artikelResponseJSON = await artikelResponse.json()
   response.render('artikel.liquid', { news: artikelResponseJSON.data })  
})

app.get('/nieuws', async function (request, response) {
   const artikelResponse = await fetch('https://fdnd-agency.directus.app/items/frankendael_news')
   const artikelResponseJSON = await artikelResponse.json()
   response.render('nieuws.liquid', { news: artikelResponseJSON.data })  
})

app.get('/artikel/:slug', async function (request, response) {
   const artikelResponse = await fetch('https://fdnd-agency.directus.app/items/frankendael_news?filter[slug]='+ request.params.slug)
   const artikelResponseJSON = await artikelResponse.json()
   response.render('artikel.liquid', { news: artikelResponseJSON.data[0] })  
})

app.get('/suggesties', async function (request, response) {
   const suggestionResponse = await fetch('https://fdnd-agency.directus.app/items/frankendael_suggestions')
   const suggestionResponseJSON = await suggestionResponse.json()
   response.render('suggesties.liquid', { suggestions: suggestionResponseJSON.data })  
})

app.get('/jouw-suggestie', async function (request, response) {
   response.render('jouw-suggestie.liquid')
})

app.post('/jouw-suggestie', async (request, response) => {
  const postResponse = await fetch('https://fdnd-agency.directus.app/items/frankendael_suggestions', {
    method: 'POST',        
    body: JSON.stringify({
      suggestion: request.body.suggestion,
      suggestion_reason: request.body.suggestion_reason
    }),
   headers: {
      'Content-Type': 'application/json',
   }
  });
  response.redirect(303, '/suggesties')
})


app.post('/suggesties/delete/:id', async (request, response) => {
   const idsuggestion = request.params.id 
  await fetch(`https://fdnd-agency.directus.app/items/frankendael_suggestions/${idsuggestion}`, {
    method: 'DELETE'        
  });

  response.redirect(303, '/suggesties')
})

app.get('/veldverkenner', async function (request, response) {
   response.render('veldverkenner.liquid')
})

app.get('/collectie', async function (request, response) {
   response.render('collectie.liquid')
})

app.post('/', async function (request, response) {
   response.redirect(303, '/')
})

app.use((request, response) => {
   app.use((req, res, next) => { res.status(404).send("oeps!, dit bestaat nog niet!") })
});

app.set('port', process.env.PORT || 8000)
app.listen(app.get('port'), function () {
   console.log(`Application started on http://localhost:${app.get('port')}`)
})

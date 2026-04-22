console.log('Hier komt je server voor Sprint 10.')

console.log('Gebruik uit Sprint 9 alleen de code die je mee wilt nemen.')

console.log('Zet \'m op!')


// Importeer het npm package Express (uit de door npm aangemaakte node_modules map)
// Deze package is geïnstalleerd via `npm install`, en staat als 'dependency' in package.json
import express from 'express'

// Importeer de Liquid package (ook als dependency via npm geïnstalleerd)
import { Liquid } from 'liquidjs';


console.log('wow')
// Doe een fetch naar de data die je nodig hebt
// const apiResponse = await fetch('...')
// Lees van de response van die fetch het JSON object in, waar we iets mee kunnen doen
// const apiResponseJSON = await apiResponse.json()

// Controleer eventueel de data in je console
// (Let op: dit is _niet_ de console van je browser, maar van NodeJS, in je terminal)
// console.log(apiResponseJSON)


// Maak een nieuwe Express applicatie aan, waarin we de server configureren
const app = express()

// Maak werken met data uit formulieren iets prettiger
app.use(express.urlencoded({ extended: true }))

// Gebruik de map 'public' voor statische bestanden (resources zoals CSS, JavaScript, afbeeldingen en fonts)
// Bestanden in deze map kunnen dus door de browser gebruikt worden
app.use(express.static('public'))

// Stel Liquid in als 'view engine'
const engine = new Liquid();
app.engine('liquid', engine.express());

// Stel de map met Liquid templates in
// Let op: de browser kan deze bestanden niet rechtstreeks laden (zoals voorheen met HTML bestanden)
app.set('views', './views')


// load de home
app.get('/', async function (request, response) {

// Haal alle nieuwsartikelen uit de directus API op
   const artikelResponse = await fetch('https://fdnd-agency.directus.app/items/frankendael_news')

   // En haal daarvan de JSON op
   const artikelResponseJSON = await artikelResponse.json()
   response.render('index.liquid', { news: artikelResponseJSON.data })  
})


// laad de data in de artikel page
app.get('/artikel', async function (request, response) {

// Haal alle nieuwsartikelen uit de directus API op
   const artikelResponse = await fetch('https://fdnd-agency.directus.app/items/frankendael_news')

   // En haal daarvan de JSON op
   const artikelResponseJSON = await artikelResponse.json()
   response.render('artikel.liquid', { news: artikelResponseJSON.data })  
})
//////////////////



// load de nieuws
app.get('/nieuws', async function (request, response) {

   // Haal alle nieuwsartikelen uit de directus API op
   const artikelResponse = await fetch('https://fdnd-agency.directus.app/items/frankendael_news')

   // En haal daarvan de JSON op
   const artikelResponseJSON = await artikelResponse.json()
   response.render('nieuws.liquid', { news: artikelResponseJSON.data })  
})
//////////////////
// maak een nieuws slug
app.get('/artikel/:slug', async function (request, response) {

   // Haal alle nieuwsartikelen uit de directus API op
   const artikelResponse = await fetch('https://fdnd-agency.directus.app/items/frankendael_news?filter[slug]='+ request.params.slug)

   // En haal daarvan de JSON op
   const artikelResponseJSON = await artikelResponse.json()
   response.render('artikel.liquid', { news: artikelResponseJSON.data[0] })  
})
  
/////////////////////////////////

app.get('/suggesties', async function (request, response) {
// Haal alle suggestions uit de database op
   const suggestionResponse = await fetch('https://fdnd-agency.directus.app/items/frankendael_suggestions')

   // En haal daarvan de JSON op
   const suggestionResponseJSON = await suggestionResponse.json()
   // stuur de data mee naar liquid (de html, CSS files hier)
   response.render('suggesties.liquid', { suggestions: suggestionResponseJSON.data })  
})

app.get('/jouw-suggestie', async function (request, response) {
   // Render jouw-suggestie.liquid uit de Views map
   // Geef hier eventueel data aan mee
   response.render('jouw-suggestie.liquid')
})

/////////////////////////////////////////////////
// POST + DELETE GEDEELTE

app.post('/jouw-suggestie', async (request, response) => {

   console.log(request)
  // Stuur een POST request naar de messages tabel
  // Een POST request bevat ook extra parameters, naast een URL
  const postResponse = await fetch('https://fdnd-agency.directus.app/items/frankendael_suggestions', {

    // Overschrijf de standaard GET method, want ook hier gaan we iets veranderen op de server
    method: 'POST',        
    // Geef de body mee als JSON string
    body: JSON.stringify({
      // de variabelen uit de database 
      suggestion: request.body.suggestion,
      suggestion_reason: request.body.suggestion_reason
    }),
   headers: {
      'Content-Type': 'application/json',
   }
   
    // En vergeet deze HTTP headers niet: hiermee vertellen we de server dat we JSON doorsturen
    // (In realistischere projecten zou je hier ook authentication headers of een sleutel meegeven)
  });

  // Stuur de browser daarna weer naar de homepage
  response.redirect(303, '/suggesties')
})

app.post('/suggesties/delete/:id', async (request, response) => {

   const idsuggestion = request.params.id 
   console.log(`https://fdnd-agency.directus.app/items/frankendael_suggestions/${idsuggestion}`)
  // Stuur een POST request naar de messages tabel
  // Een POST request bevat ook extra parameters, naast een URL
  await fetch(`https://fdnd-agency.directus.app/items/frankendael_suggestions/${idsuggestion}`, {
   
    // Overschrijf de standaard GET method, want ook hier gaan we iets veranderen op de server
    method: 'DELETE'        
   
    // En vergeet deze HTTP headers niet: hiermee vertellen we de server dat we JSON doorsturen
    // (In realistischere projecten zou je hier ook authentication headers of een sleutel meegeven)
  });

  // Stuur de browser daarna weer naar de homepage
  response.redirect(303, '/suggesties')
})
// EINDE POST + DELETE GEDEELTE
///////////////////////////////////////////////

app.get('/veldverkenner', async function (request, response) {
   // Render index.liquid uit de Views map
   // Geef hier eventueel data aan mee
   response.render('veldverkenner.liquid')
})

app.get('/collectie', async function (request, response) {
   // Render index.liquid uit de Views map
   // Geef hier eventueel data aan mee
   response.render('collectie.liquid')
})

// Maak een POST route voor de index; hiermee kun je bijvoorbeeld formulieren afvangen
// Hier doen we nu nog niets mee, maar je kunt er mee spelen als je wilt
app.post('/', async function (request, response) {
   // Je zou hier data kunnen opslaan, of veranderen, of wat je maar wilt
   // Er is nog geen afhandeling van een POST, dus stuur de bezoeker terug naar /
   response.redirect(303, '/')
})

app.use((request, response) => {
   app.use((req, res, next) => { res.status(404).send("oeps!, dit bestaat nog niet!") })
});

// Stel het poortnummer in waar Express op moet gaan luisteren
// Lokaal is dit poort 8000, als dit ergens gehost wordt, is het waarschijnlijk poort 80
app.set('port', process.env.PORT || 8000)

// Start Express op, haal daarbij het zojuist ingestelde poortnummer op
app.listen(app.get('port'), function () {
   // Toon een bericht in de console en geef het poortnummer door
   console.log(`Application started on http://localhost:${app.get('port')}`)
})

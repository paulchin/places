const axios = require('axios');
const express = require('express');
const hbs = require('hbs');
const server = express();
const bodyParser = require('body-parser');
const filemgr = require('./filemgr');
const port = process.env.PORT || 3000;

server.use(bodyParser.urlencoded({ extended: true}));
server.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/views/partials');

var allResults;

hbs.registerHelper('list', (items, options) => {
 items = allResults;

 var out = "<tr><th>Address</th><th>Icon</th><th>Photo Reference</th></tr>";

 const length = items.length;

 for(var i=0; i<length; i++){
   out = out +  options.fn(items[i]);
 }
 console.log(out);
 return out;
});

server.get('/', (req, res) => {
  res.render('home.hbs');
});

server.get('/form', (req, res) => {
  res.render('form.hbs');
});

server.post('/getplaces', (req, res) => {
  const addr = req.body.address;
  const locationReq = `https://maps.googleapis.com/maps/api/geocode/json?address=${addr}&key=AIzaSyAn7h3tsW_p0md5iISNFzLcJDoRGRgjWPg`;

  axios.get(locationReq).then((response) => {
    const locationData = {
      addr: response.data.results[0].formatted_address,
      lat: response.data.results[0].geometry.location.lat,
      lng: response.data.results[0].geometry.location.lng,
    }
    const httpURL = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?';
    const API_KEY = 'AIzaSyDhUDwXlhJF0pzMIg4NoBr5LEifvOXMxbE';
    const placesReq = `${httpURL}location=${locationData.lat},${locationData.lng}&radius=1500&type=school&keyword=school&key=${API_KEY}`;

    return axios.get(placesReq);
    //res.status(200).send(JSON.stringify(locationData));
  }).then((response) => {
    //res.status(200).send(response.data.results);
    allResults = response.data.results;
    res.render('result.hbs');
  })
  .catch((error) => {
    res.status(200).send('ERRO');
  });


  //const result = { address: addr };
  //res.render('result.hbs',result);
});

server.listen(port, () => {
  console.log(`server started on port ${port}`);
});

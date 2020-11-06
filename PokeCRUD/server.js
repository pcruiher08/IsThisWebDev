const express = require("express");
const app = express();
const cors = require("cors");
const axios = require("axios");
app.use(express.json());
app.use(cors());
app.use(
  express.urlencoded({
    extended: true,
  })
);

var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb+srv://dbuser:dbuser@cluster0-jyf2g.mongodb.net/PokeDB?retryWrites=true&w=majority';
MongoClient.connect(url, { useUnifiedTopology: true },function(err, db) {
  if (err) throw err;
  var dbo = db.db("PokeDB");

  app.get("/getGame", function (req, res) {
    let oldGames = [];
    dbo
      .collection("Juegos")
      .find()
      .project({ _id: 0, id: 1 })
      .toArray(function (err, result) {
        result.forEach((id) => {
          oldGames.push(id.id);
        });
        if (oldGames.length == 1){
          res.send(String(2));
        }
        
        var max = Math.max(...oldGames);
        console.log("New MAX:")
        console.log(max++);
        res.send(String(max));
        
      });
  });

  app.get("/getGameCards", function (req, res){
    let params = getParams(req);
    let playCards = [];
    let gameID = params.id;
    dbo
      .collection("mazoDB")
      .find()
      .toArray(function (err, result){
        for (let i = 0; i < 5; i++) {
          let index = Math.floor(Math.random() * 60);
          const element = result[index];
          playCards.push(element);
        }
        let query = { id: gameID };
        let newCARDS = { $push: { cards: { $each: playCards } } };
        dbo
          .collection("Juegos")
          .updateOne(query, newCARDS, function (err, res) {
            if (err) throw err;
            console.log("Added cards to game: ", gameID);
          });
        res.send("DONE");
      });
  });

  app.get("/updateStat", async (req, res) => {
    let params = getParams(req);
    let gameID = params.id;
    console.log("Update status game", gameID);
    dbo
      .collection("Juegos")
      .find({ id: gameID })
      .project({ _id: 0, cards: 1 })
      .toArray(function (err, result) {
        res.send(result);
      });
  });


  app.post("/createGame", async(req,res) => {
    let params = getParams(req);
    params = params.params;
    let gameID = params.id;
    let playCards = [];
    dbo
      .collection("mazoDB")
      .find()
      .toArray(function (err, result) {
        for (let index = 0; index < 5; index++) {
          let indice = Math.floor(Math.random() * 7);
          const element = result[indice];
          playCards.push(element);
        }
        let pokecard = { id: gameID, cards: playCards }
        dbo.collection("Juegos").insertOne(pokecard);
        console.log("Game: ", gameID, "created")
        res.send("DONE");
      });
  })

  app.post("/add", async (req, res) => {
    let params = getParams(req);
    params = params.params
    let card_Type = params.type;
    let name = params.name;
    let data;
    if (card_Type == "pokemon") {
      data = await getPokemonCard(name);
    } else {
      data = params.data;
    }
    let pokecard = { name: name, typecard: card_Type, data: data };
    dbo.collection("mazoDB").insertOne(pokecard);
    res.send("DONE");
  });

  app.get("/get/:pokename", (req, res) => {
    let params = getParams(req);
    let name = params.pokename; 
    dbo.collection("mazoDB").find({name : name}).toArray(function(err, result){ res.send(result) });
    
  });
  
  app.delete("/delete/:pokename", function (req, res) {
    let params = getParams(req);
    let name = params.pokename; 
    dbo.collection("mazoDB").remove({name : name})
    res.send("DELETED")
  });
  
  app.get("/get", function (req, res) {
    dbo.collection("mazoDB").find().toArray(function(err, result){ res.send(result) });
  });
  
  app.put("/put/:pokename", function (req, res) {
    let params = getParams(req);
    params = params.params
    let pokename = params.name;
    let pokedata = params.data;
    var myquery = { name : pokename };
    var newvalues = {$set : {data : pokedata}};
    dbo.collection("mazoDB").updateOne(myquery, newvalues, function(err, res) {
      if (err) throw err;
    });
    res.send("UPDATED");
  });
  
});

function getParams(req) {
  return Object.assign({}, req.body, req.params, req.query);
}

const getPokemonData = (name) => {
  return axios
    .get(`https://pokeapi.co/api/v2/pokemon/${name}`)
    .then((response) => response.data);
};

const getPokemonCard = async (name) => {
  let APIDATA = await getPokemonData(name);
  let typeNames = [];
  APIDATA.types.forEach((typeData) => {
    typeNames.push(typeData.type.name);
  });
  let POKECARD = {
    name: APIDATA.name,
    id: APIDATA.id,
    weight: APIDATA.weight,
    height: APIDATA.height,
    base_experience: APIDATA.base_experience,
    sprites: APIDATA.sprites,
    typeNames,
  };
  return POKECARD;
};
app.listen(3000);
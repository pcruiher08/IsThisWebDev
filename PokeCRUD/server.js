const cors = require("cors");
const axios = require("axios");
const express = require("express");
const app = express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({extended: true,}));

var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb+srv://dbuser:dbuser@cluster0-jyf2g.mongodb.net/PokeDB?retryWrites=true&w=majority';
MongoClient.connect(url, { useUnifiedTopology: true },function(err, db) {
  if (err) throw err;
  var instanceOfMongoDataBase = db.db("PokeDB");
  app.get("/getGame", function (req, res) {
    let prev = [];
    instanceOfMongoDataBase.collection("Juegos").find().project({ _id: 0, id: 1 }).toArray(function (err, result) {
        result.forEach((id) => { prev.push(id.id);});
        //res.send(String(prev.length + 1));
        if (prev.length == 0){
          res.send(String(1));
        }
        if (prev.length == 1){
          res.send(String(2));
        }
        res.send(String(Math.max(...prev) + 1));
      });
  });

  app.get("/getCards", function (req, res){
    let params = getInnerData(req);
    let arrOfCards = [];
    let gameNumber = params.id;
    instanceOfMongoDataBase
      .collection("mazoDB")
      .find()
      .toArray(function (err, result){
        for (let i = 0; i < 5; i++) {
          let index = Math.floor(Math.random() * 60);
          const element = result[index];
          arrOfCards.push(element);
        }
        instanceOfMongoDataBase
          .collection("Juegos")
          .updateOne({ id: gameNumber }, { $push: { cards: { $each: arrOfCards } } }, function (err, res) {
            if (err) throw err;
            console.log("Added cards to game: ", gameNumber);
          });
        res.send(".");
      });
  });

  app.get("/update", async (req, res) => {
    let params = getInnerData(req);
    let gameNumber = params.id;
    console.log("Update game", gameNumber);
    instanceOfMongoDataBase.collection("Juegos").find({ id: gameNumber }).project({ _id: 0, cards: 1 })
      .toArray(function (err, result) {
        res.send(result);
      });
  });


  app.post("/createGame", async(req,res) => {
    let arrOfCards = [];
    instanceOfMongoDataBase.collection("mazoDB").find().toArray(function (err, result) {
        for (let i = 0; i < 5; i++) {
          arrOfCards.push(result[Math.floor(Math.random() * 30)]);
        }
        instanceOfMongoDataBase.collection("Juegos").insertOne({ id: getInnerData(req).params.id, cards: arrOfCards });
        console.log(getInnerData(req).params.id, "stablished")
        res.send(".");
      });
  })

  app.post("/add", async (req, res) => {
    let params = getInnerData(req);
    params = params.params
    let tipoDeCarta = params.type;
    let name = params.name;
    let data;
    if (tipoDeCarta == "pokemon") {
      data = await getPokemonCard(name);
    } else {
      data = params.data;
    }
    let pokecard = { name: name, typecard: tipoDeCarta, data: data };
    instanceOfMongoDataBase.collection("mazoDB").insertOne(pokecard);
    res.send(".");
  });

  app.get("/get/:pokename", (req, res) => {
    let params = getInnerData(req);
    let name = params.pokename; 
    instanceOfMongoDataBase.collection("mazoDB").find({name : name}).toArray(function(err, result){ res.send(result) });
    
  });
  
  app.delete("/delete/:pokename", function (req, res) {
    let params = getInnerData(req);
    let name = params.pokename; 
    instanceOfMongoDataBase.collection("mazoDB").remove({name : name})
    res.send("DELETED")
  });
  
  app.get("/get", function (req, res) {
    instanceOfMongoDataBase.collection("mazoDB").find().toArray(function(err, result){ res.send(result) });
  });
  
  app.put("/put/:pokename", function (req, res) {
    let params = getInnerData(req);
    params = params.params
    let pokename = params.name;
    let pokedata = params.data;
    var myquery = { name : pokename };
    var newvalues = {$set : {data : pokedata}};
    instanceOfMongoDataBase.collection("mazoDB").updateOne(myquery, newvalues, function(err, res) {
      if (err) throw err;
    });
    res.send("UPDATED");
  });
});

function getInnerData(req) {
  return Object.assign({}, req.body, req.params, req.query);
}

const getPokemonData = (name) => {
  return axios
    .get(`https://pokeapi.co/api/v2/pokemon/${name}`)
    .then((response) => response.data);
};

const getPokemonCard = async (name) => {
  let response = await getPokemonData(name);
  let typeNames = [];
  response.types.forEach((typeData) => {
    typeNames.push(typeData.type.name);
  });
  let newCard = {name: response.name,id: response.id,weight: response.weight,height: response.height,base_experience: response.base_experience,sprites: response.sprites,typeNames,};
  return newCard;
};
app.listen(3000);
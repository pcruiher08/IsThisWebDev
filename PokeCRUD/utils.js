document.addEventListener("DOMContentLoaded", (ignore) => {
    if (document.getElementById("index").innerHTML == "Pokemons") {
      document.getElementById("add-item").addEventListener("click", getPokemon);
      document.getElementById("getAll").addEventListener("click", getAll);
      document.getElementById("getID").addEventListener("click", getName);
      document.getElementById("delete").addEventListener("click", deleteCard);
      document.getElementById("update").addEventListener("click", processUpdate);
    }else{
      document.getElementById("spielen").addEventListener("click", startGame);
      document.getElementById("gimmeCards").addEventListener("click", getTheCards);
    }
  });

  function startGame() {
    axios
      .get(`http://localhost:3000/getGame`)
      .then((response) => {
        console.log("Conecting");
        let id = response.data;
        console.log(id)
        localStorage.setItem("GameID", id);
        let aux = localStorage.getItem("GameID");
        console.log(aux);
        document.getElementById("yaSeConecto").innerHTML = "Cards Space";
        axios.post("http://localhost:3000/createGame", {params : { id : localStorage.getItem("GameID")}}).then((response) => { });
        updateGame();
        setInterval(updateGame, 5000);
      }).catch((err) => {});}

  function getTheCards() {
    axios
      .get(`http://localhost:3000/getCards`, {
        params: {
          id: localStorage.getItem("GameID"),
        },
      })
      .then((response) => {
        updateGame();
      })
      .catch((err) => {
      });
  }
  
  function updateGame() {
    axios
      .get(`http://localhost:3000/update`, {
        params: {
          id: localStorage.getItem("GameID"),
        },
      })
      .then((response) => {
        document.getElementById("items").innerHTML = "";
        response.data[0].cards.forEach((element) => {
          if (element.typecard == "pokemon") {
            addPokemon(element);
          } else {
            addCard(element);
          }
        });
      })
      .catch((err) => {
      });
  }
  
  let byli = (name,id,weight,height,base_experience,image,types) => {
    return `<div class="added-pokemon pokecard" >
            <h1>
                Name: ${name} 
                <h1> id: ${id} </h1> 
            </h1> 
            <div>
                <img src="${image}">
            </div> 
            <div>
                types: ${types}
                <div>
                    weight: ${weight} height: ${height} 
                    <div> 
                        base experience: ${base_experience} 
                    </div>
                </div>
            </div>
            </div>`;
  };
  
  let byliItem = (name,type,data) => {
    return `<div class="added-pokemon pokecard">
                <h1>
                    Name: ${name} Type Card: ${type} 
                </h1> 
                <div> 
                    Data: ${data} 
                </div>
            </div>`;
  };
  
  function processUpdate(){
    let name = document.querySelector("#update-pokemon").value;
    let data = document.querySelector("#data-update").value
    axios
    .put(`http://localhost:3000/put/${name}`, {params: {name : name,data : data}})
      .then((response) => {})
      .catch((err) => {});
  }
  
  function addPokemon(datos) {
    let typeNames = [];
    datos.data.typeNames.forEach((typeData) => {typeNames.push(typeData);});
    document.getElementById("items").innerHTML += byli(datos.data.name,datos.data.id,datos.data.weight,datos.data.height,datos.data.base_experience,datos.data.sprites.front_default,typeNames);
  }
  
  function addCard(datos){
    document.getElementById("items").innerHTML += byliItem(datos.name, datos.typecard, datos.data);
  }
  
  function deleteCard(){
    axios
      .delete(`http://localhost:3000/delete/${ document.querySelector("#delete-pokemon").value.toLowerCase()}`)
      .then((response) => { })
      .catch((err) => { });
  }
    
  function getPokemon() {
    let error = document.getElementById("error");
    axios
      .post(`http://localhost:3000/add`, {
        params: {
        type : document.querySelector("#type").value,
        name : document.querySelector("#pokemon-name").value.toLowerCase(),
        data : document.querySelector("#data").value
      }})
      .then((res) => {
      })
      .catch((err) => {
        errorAtRequest(err);
      });
  }
  let errorAtRequest = (err) => {
    alert("pokemon not found in db")
  }

  function getAll(){
    document.getElementById("items").innerHTML = ""
    axios
      .get(`http://localhost:3000/get`)
      .then((response) => {
        pokearray = response.data
        pokearray.forEach(element => {
          if(element.typecard == "pokemon"){
            addPokemon(element)
          }else{
            addCard(element)}
          })}).catch((err) => {});
  }
  
  function getName(){
    document.getElementById("items").innerHTML = ""
    axios
      .get(`http://localhost:3000/get/${document.querySelector("#get-pokemon-name").value.toLowerCase()}`)
      .then((response) => {
        response.data.forEach(element => {
          if(element.typecard == "pokemon"){
            addPokemon(element)
          }else{
            addCard(element)
          }
        })
      })
      .catch((err) => { errorAtRequest(err); });
  }

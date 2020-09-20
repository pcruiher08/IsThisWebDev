function newTotal() {
    let pokelist = document.getElementById("item-list");
    let addedPokemon = pokelist.getElementsByClassName("added-item")
    let total = 0;
    for(var i = 0; i < addedPokemon.length; i++) 
        total += Number(addedPokemon[i].getElementsByClassName("weight")[0].innerHTML);
    document.getElementById("total").getElementsByClassName("total-value")[0].innerHTML = total;
}

let get_pokemon_data = () => {
    return (event) => {
        let pokemon_name = document.getElementById("item-name").value;
        pokemon_name = pokemon_name.toLowerCase();
        if (pokemon_name.length == 0){
            alert("Oak's words echoed... \"There's a time and place for everything but not now!\"");
            return;
        }
        axios.get('https://pokeapi.co/api/v2/pokemon/' + pokemon_name)
        .then(function (response) {
            let pokelist = document.getElementById("item-list");
            let item_element = document.createElement("div");
            item_element.innerHTML = `<div class="added-item"><img class="icon" src=${response.data.sprites.front_default}>${response.data.species.name} -<span class="weight" style="margin-left:5px;">${response.data.weight}</span><button class="remove-item">Delete</button></div>`;
            pokelist.appendChild(item_element);
            let deleteButton = item_element.getElementsByClassName("remove-item")[0];
            deleteButton.addEventListener("click",(event) => {
                let node_to_remove = event.target;
                node_to_remove.parentNode.parentNode.remove();
                newTotal();
            });
            newTotal();
        })
        .catch(function (error) {
            alert("Oak's words echoed... \"There's a time and place for everything but not now!\"\nA Pokemon named '" + pokemon_name + "' cannot be found");
        });
    }
}
document.getElementById("add-item").addEventListener("click", get_pokemon_data());
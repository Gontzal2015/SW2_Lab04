window.onload=inicializar
let checkbox
class Pokemon {

    // (1)
    static activePokemon = null;
    // (2)
    static keys = {
        ArrowUp: false,
        ArrowDown: false,
        ArrowLeft: false,
        ArrowRight: false
    };

    constructor(name, sprite) {
        this.name = name;
        this.sprite = sprite;
        this.element = this.createElement();
        this.addEventListeners();
    }
    
    createElement() {
      // (3)   
      const img = this.sprite;
      img.style.position = 'absolute';
      img.style.top = Math.ceil(Math.random()*100) + 'px';
      img.style.left = Math.ceil(Math.random()*100) + 'px';
      document.body.appendChild(img);
      return img;
    }
    
    addEventListeners() {   
     	// (4)
      this.element.addEventListener('click', () => {
            Pokemon.activePokemon = this;
        });
    }
    
    move(step) { 
    	// (5)
      let top = parseInt(this.element.style.top);
      let left = parseInt(this.element.style.left);
      if (Pokemon.keys.ArrowUp) 
        this.element.style.top =top-step + 'px';
      if (Pokemon.keys.ArrowDown)    
        this.element.style.top =top+step+ 'px';
      if (Pokemon.keys.ArrowLeft)
        this.element.style.left =left-10+ 'px';
      if (Pokemon.keys.ArrowRight) 
        this.element.style.left =left+10+ 'px';
    }
} // end of Pokemon class


document.addEventListener('keydown', function (event) {  
   // (6)
   Pokemon.keys[event.key] = true;
});

document.addEventListener('keyup', function (event) {
  // (7)
  Pokemon.keys[event.key]=false;
});

function moveActivePokemon() {
  // (8) 
  const step = 5;
    if (Pokemon.activePokemon) {
      Pokemon.activePokemon.move(step);
    }

}

setInterval(moveActivePokemon, 10);

// Instantiate Pokémon
const pokemonNames = ['pikachu', 'bulbasaur', 'charmander', 'squirtle'];

function cargarJuego () {
  // llamar a loadImage
  Promise.all(pokemonNames.map(pokemon_name =>fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon_name}`)
  .then(r=>r.json())
  .then(data=>loadImage(data.sprites.front_default)
  .then(img=>new Pokemon(data.name,img)))))
  // Cargar los Pokemon de pokemonNames con Promise.all (NO usar forEach):
  // se lanzan todas las peticiones en paralelo y se espera a que terminen todas.
  
}

function loadImage(url) {
  return new Promise((resolve, reject) => {
    if (!url) {
      reject(new Error('El Pokémon no tiene una imagen disponible'))
      return
    }

    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error(`No se pudo cargar la imagen: ${url}`))
    image.src = url
  })
}




function BuscarPokemon() {
  if(!checkbox.checked){
    fetch(`https://pokeapi.co/api/v2/pokemon/${nombre.value}`)
    .then(r=>r.json())
    .then(data=>loadImage(data.sprites.front_default)
    .then(img=>new Pokemon(data.name,img)))
  }
  else{
    fetch(`https://pokeapi.co/api/v2/pokemon/${nombre.value}`)
    .then(r=>r.json())
    .then(data=>loadImage(data.sprites.front_shiny)
    .then(img=>new Pokemon(data.name,img)))
  }

}



function inicializar(){
  let nombre=document.getElementById("nombre")
  checkbox=document.getElementById("shiny")
  let boton=document.getElementById("buscarPokemon")
  let busqueda=boton.addEventListener('click', BuscarPokemon)
  cargarJuego()
}
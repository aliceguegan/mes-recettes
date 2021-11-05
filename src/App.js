import React from 'react';
import './App.css';
import illustration from './images/illustration-plat.png';

function recette (n, i1, i2) {
    this.nom = n;
    this.ingredients = i1;
    this.instructions = i2;
}

let recettesList = [];

class Recettes extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      recettes: recettesList,
      nom: '',
      newNom: '',
      ingredients: [],
      newIngredients: [],
      ingredientsCounter: 0,
      newCounter: 0,
      instructions: '',
      newInstructions: ''
    };
    this.getRecipe = this.getRecipe.bind(this);
    this.handleName = this.handleName.bind(this);
    this.handleIngredients = this.handleIngredients.bind(this);
    this.addIngredient = this.addIngredient.bind(this);
    this.handleInstructions = this.handleInstructions.bind(this);
    this.edit = this.edit.bind(this);
    this.saveModifs = this.saveModifs.bind(this);
    this.delete = this.delete.bind(this);
    this.close = this.close.bind(this);
  }

  getRecipe(e){
      let selectedRecipe = this.state.recettes.filter(toFind => toFind.nom === e.target.id)[0];
    this.setState({nom: selectedRecipe.nom, ingredients: selectedRecipe.ingredients, ingredientsCounter: Object.keys(selectedRecipe.ingredients).length, instructions: selectedRecipe.instructions});

    document.getElementById("liste-recettes").style.display = "none";
    document.getElementById("titre-toutes-recettes").style.display = "none";
    document.getElementById("boutons-recette").style.display = "block";
    document.getElementById("recette-detail").style.display = "block";
  };

  handleName(e){
    return this.setState({newNom: e.target.value})
  }

  handleIngredients(e){
    let newIngredients = this.state.newIngredients
    newIngredients[e.target.name] = e.target.value;

    return this.setState({newIngredients: newIngredients})
  };

  addIngredient(e){
    e.preventDefault();

    return this.setState({newIngredients: [...this.state.newIngredients, ''], newCounter: this.state.newCounter + 1})
  }

  handleInstructions(e){
    return this.setState({newInstructions: e.target.value})
  }

  edit(e){
    e.preventDefault();

    if(document.getElementById("recette-edit").style.display === "block"){
      document.getElementById("infos-recette").style.display = "block";

      document.getElementById("recette-edit").reset();
      document.getElementById("recette-edit").style.display = "none";

      document.getElementById("edit-fini").style.display = "none";

      return this.setState({newNom: '', newCounter: '', newIngredients: '', newInstructions: ''});
    } else {
      document.getElementById("infos-recette").style.display = "none";

      document.getElementById("recette-edit").style.display = "block";

      document.getElementById("edit-fini").style.display = "block";

      return this.setState({newNom: this.state.nom, newCounter: this.state.ingredientsCounter, newIngredients: [...this.state.ingredients], newInstructions: this.state.instructions});
    }
  };

  saveModifs(e){
    e.preventDefault();
    if(document.getElementById("nom-recette-edit").value !== '' && this.state.newIngredients.filter(item => item !== '' && item !== undefined).length > 0 && document.getElementById("instructions-recette-edit").value !== ''){

      document.getElementById("recette-edit").style.display = "none";

      document.getElementById("infos-recette").style.display = "block";

      document.getElementById("edit-fini").style.display = "none";
      document.getElementById("error-edit").style.display = "none";

      let newNom = this.state.newNom;
      let newIngredients = this.state.newIngredients.filter(item => item !== '' && item !== undefined);
      let newInstructions = this.state.newInstructions;

      let selectedRecipe = recettesList.filter(toFind => toFind.nom === this.state.nom)[0];
      let indexToReplace = recettesList.indexOf(selectedRecipe);

      this.setState({nom: newNom, ingredients: newIngredients, ingredientsCounter: newIngredients.length - 1, instructions: newInstructions})

      let updatedRecipe = new recette(this.state.newNom, newIngredients, this.state.newInstructions);

      recettesList.splice(indexToReplace, 1, updatedRecipe);

      this.setState({recettes: recettesList, newNom: '', newIngredients: [], newCounter: 0, newInstructions: ''})

    } else {
      document.getElementById("error-edit").style.display = "block";
    }
  }

  close(){
    if(document.getElementById("recette-edit").style.display === "block"){
      document.getElementById("recette-edit").reset();
      document.getElementById("recette-edit").style.display = "none";
      document.getElementById("infos-recette").style.display = "block";
    } else {
      document.getElementById("recette-detail").style.display = "none";
      document.getElementById("liste-recettes").style.display = "block";
      document.getElementById("titre-toutes-recettes").style.display = "block";
    }
  };

  delete(){
    let selectedRecipe = recettesList.filter(toFind => toFind.nom === this.state.nom)[0];
    let indexToDelete = recettesList.indexOf(selectedRecipe);
    recettesList.splice(indexToDelete, 1);

    this.setState({
      recettes: recettesList,
      nom: '',
      newNom: '',
      ingredients: [],
      newIngredients: [],
      ingredientsCounter: 0,
      newCounter: 0,
      instructions: '',
      newInstructions: ''
    });

    this.close();
  };

  render(){

    if(recettesList.length === 0){
      return (
        <div>
          <h3 id="no-recipe">Aucune recette enregistrée</h3>
        </div>
      )
    } else {
    return (
      <div id="recettes-component">
        <h2 id="titre-toutes-recettes">Toutes les recettes</h2>
        <div id="liste-recettes">
          {this.state.recettes.map(item => (<p onClick={this.getRecipe} id={item.nom} key={item.nom}>{item.nom}</p>))}
        </div>
        <div id="recette-detail">
          <div id="boutons-recette">
            <button title="Editer" onClick={this.edit}>✎</button>
            <button title="Supprimer" onClick={this.delete}>🗑</button>
            <button title="Fermer" onClick={this.close}>X</button>
          </div>
          <div id="infos-recette">
            <h3 id="nom-recette">{this.state.nom}</h3>
            <h4>Ingrédients :</h4>
            <ul id="ingredients-recette">
              {Array.from(this.state.ingredients).map(key => <li name={key} key={key}>{key}</li>)}
            </ul>
            <h4>Instructions :</h4>
            <p id="instructions-recette">{this.state.instructions}</p>
          </div>

          <form id="recette-edit">
            <label htmlFor="name-edit">Nom</label>
            <input type="text" name="name-edit" id="nom-recette-edit" defaultValue={this.state.nom} onChange={this.handleName} required></input>
            <br />
            <fieldset>
            <legend>Ingrédients</legend>
            <div id="ingredients-recette-edit">
              {Array.from(this.state.newIngredients).map(key => <input type="text" className="edit-ingredient" name={this.state.newIngredients.indexOf(key)} key={this.state.newIngredients.indexOf(key)} onChange={this.handleIngredients} defaultValue={key}></input>)}
            </div>
            <button id="edit-ajouter-ingredient" onClick={this.addIngredient}>+</button>
            </fieldset>
            <label htmlFor="instructions-edit">Instructions</label>
            <textarea id="instructions-recette-edit" name="instructions-edit" onChange={this.handleInstructions} defaultValue={this.state.instructions} minLength="1" required></textarea>
            <br />
            <button type="submit" id="edit-fini" onClick={this.saveModifs}>J'ai terminé</button>
            <p id="error-edit">Champ(s) manquant(s)</p>
          </form>

        </div>
      </div>
    )
  }
  }
};

class Ajouter extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      ingredientsCounter: [0, 1, 2, 3, 4, 5],
      nom: '',
      ingredients: [],
      instructions: ''
    };
    this.newIngredient = this.newIngredient.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleName = this.handleName.bind(this);
    this.handleIngredients = this.handleIngredients.bind(this);
    this.handleInstructions = this.handleInstructions.bind(this);
  }

  newIngredient(e){
    e.preventDefault();
    return this.setState({ingredientsCounter: [...this.state.ingredientsCounter, this.state.ingredientsCounter[this.state.ingredientsCounter.length - 1] + 1]});
  };

  handleName(e){
    document.getElementById("success").style.display = "none";
    return this.setState({nom: e.target.value})
  };

  handleIngredients(e){
    document.getElementById("success").style.display = "none";
    let newIngredients = this.state.ingredients;
    newIngredients[e.target.name] = e.target.value;
    return this.setState({ingredients: newIngredients});
  };

  handleInstructions(e){
    document.getElementById("success").style.display = "none";
    return this.setState({instructions: e.target.value})
  }

  handleSubmit(e){
    if(this.state.nom && Array.from(this.state.ingredients).filter(item => item !== undefined).length > 0 && this.state.instructions){
      e.preventDefault();

      let finalIngredients = Array.from(this.state.ingredients).filter(item => item !== undefined);

      let item = new recette(this.state.nom, finalIngredients, this.state.instructions);

      recettesList.push(item);

      document.getElementById("recipe-form").reset();
      document.getElementById("success").style.display = "block";

      this.setState({ingredientsCounter: [0, 1, 2, 3, 4, 5],
        nom: '',
        ingredients: [],
        instructions: ''})
    }
  };

  render(){

    return (
      <div id="ajouter-component">
        <h2 id="titre-ajouter">Ajouter une nouvelle recette :</h2>

        <form id="recipe-form">
          <label htmlFor="name">Nom</label>
          <input type="text" id="name" defaultValue={this.state.nom} onChange={this.handleName} required></input>
          <br />
          <fieldset>
            <legend>Ingrédients</legend>
            <div id="inputs">
              {Array.from(this.state.ingredientsCounter).map(item => <input type="text" className="ingredient" onChange={this.handleIngredients} name={item} key={item} defaultValue={this.state.ingredients[item]}></input>)}
            </div>
            <button onClick={this.newIngredient} id="new-ingredient">+</button>
          </fieldset>
          <label htmlFor="instructions">Instructions</label>
          <textarea id="instructions" defaultValue={this.state.instructions} onChange={this.handleInstructions} required></textarea>
          <br />
          <button type="submit" id="submit-button" onClick={this.handleSubmit}>Envoyer</button>
        </form>
        <p id="success">Recette ajoutée !</p>
      </div>
    )
  }
};

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      content: <Recettes />
    };
    this.add = this.add.bind(this);
    this.recette = this.recette.bind(this);
  }

    add(){
      return this.setState({content: <Ajouter />})
    }

    recette(){
      return this.setState({content: <Recettes />})
    }
  render(){

    return (
      <div>
        <div>
          <img src={illustration} id="illustration" alt="illustration plat"></img>
          <h1 id="main-title">Mes recettes</h1>
        </div>
        <div>
          <button onClick={this.recette} id="bouton-recettes">Recettes</button>
          <button onClick={this.add} id="bouton-ajouter">Ajouter</button>
        </div>
        <div id="main">{this.state.content}</div>
      </div>
    )
  }
}

export default App;


/*User Story: I can create recipes that have names and ingredients.

User Story: I can see an index view where the names of all the recipes are visible.

User Story: I can click into any of those recipes to view it.

User Story: I can edit these recipes.

User Story: I can delete these recipes.

User Story: All new recipes I add are saved in my browser's local storage. If I refresh the page, these recipes will still be there.*/
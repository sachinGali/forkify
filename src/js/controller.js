//internal imports
import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarkView.js';
import addRecipeView from './views/addRecipeView.js';

// external imports
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime/runtime';

// https://forkify-api.herokuapp.com/v2
if (module.hot) {
  module.hot.accept();
}
///////////////////////////////////////

const controlRecipe = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    recipeView.renderSpinner();
    bookmarksView.render(model.state.bookamarks);
    //1) Loading recipe
    await model.loadRecipe(id);
    const { recipe } = model.state;

    //2)  Rendering recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
};

const controlSearchResult = async function () {
  try {
    // 1) Get search query
    const query = searchView.getQuery();
    if (!query) return;
    // resultsView.renderSpinner();
    // 2) Load search result
    await model.loadSearchResults(query);

    // 3) Render result
    // console.log(model.state.search.results);
    resultsView.render(model.getSearchResultsPage(1));

    //Render initial pagination btn

    paginationView.render(model.state.search);
  } catch (err) {
    throw err;
  }
};

const controlPagination = function (goToPage) {
  // 3) Render New Results
  // console.log(model.state.search.results);
  resultsView.render(model.getSearchResultsPage(goToPage));

  //Render initial pagination btn

  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  //Update the recipe servinbgs (in state)
  model.updateServings(newServings);
  // update the recipe view
  recipeView.render(model.state.recipe);
};

const controlAddBookmark = function () {
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  //2) Update recipe view
  recipeView.render(model.state.recipe);

  //Render Bookmards

  bookmarksView.render(model.state.bookamarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
   await model.uploadRecipe(newRecipe);
    
  } catch (err) {
    console.error('', err);
    addRecipeView.renderError(err.message);
  }
  //Upload new recipe data
};

const init = function () {
  recipeView.addHandlerRender(controlRecipe);
  recipeView.addHandlerAddBookamrk(controlAddBookmark);
  // recipeView.addHandlerUpdateServings(controlServings)
  searchView.addHandlerSearch(controlSearchResult);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView._addHandlerUpload(controlAddRecipe);
  // controlSearchResult();
};
init();

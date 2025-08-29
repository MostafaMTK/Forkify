// these to support old browsers
import 'core-js/stable';
import 'regenerator-runtime/runtime';

import { MODAL_CLOSE_SEC } from './config.js';
import * as model from './model.js';
import recipeViewer from './views/recipeView.js';
import searchViewer from './views/searchView.js';
import resultsViewer from './views/resultsView.js';
import pagginationViewer from './views/pagginationView.js';
import bookmarksViewer from './views/BookmarksView.js';
import addRecipeViewer from './views/AddRecipeView.js';
// NEW API URL (instead of the one shown in the video)
// https://forkify-api.jonas.io

///////////////////////////////////////
// if (module.hot) {
//   module.hot.accept();
// }

const controlRecipes = async function () {
  try {
    const id = window.location.hash?.slice(1);
    if (!id) return;
    //Load Spinner
    recipeViewer.renderSpinner();
    // Get Data
    await model.loadRecipe(id);
    //Choose the recipe
    resultsViewer.update(model.getSearchResultsPage());
    bookmarksViewer.update(model.state.bookmarks);
    //Render The Data
    recipeViewer.render(model.state.recipe);
  } catch (err) {
    recipeViewer.renderError();
  }
};

const controlSearch = async function () {
  try {
    //Get Search Query
    const query = searchViewer.getQuery();
    if (!query) return;
    resultsViewer.renderSpinner();
    //Load Search Results
    await model.loadSearchResults(query);

    //Render Results
    resultsViewer.render(model.getSearchResultsPage());

    //Render Paggination Buttons
    pagginationViewer.render(model.state.search);
  } catch (err) {
    resultsViewer.renderError();
  }
};

const controlPaggination = function (gotoPage) {
  //Render Results
  resultsViewer.render(model.getSearchResultsPage(gotoPage));

  //Render Paggination Buttons
  pagginationViewer.render(model.state.search);
};

const controlServings = function (newServings) {
  model.updateServings(newServings);
  recipeViewer.update(model.state.recipe);
};

const controlAddBookmark = function () {
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);
  recipeViewer.update(model.state.recipe);
  bookmarksViewer.render(model.state.bookmarks);
};
const controlBookmarks = function () {
  bookmarksViewer.render(model.state.bookmarks);
};
const controlAddRecipe = async function (newRecipe) {
  try {
    addRecipeViewer.renderSpinner();
    await model.uploadRecipe(newRecipe);
    recipeViewer.render(model.state.recipe);
    addRecipeViewer.renderMessage();
    bookmarksViewer.render(model.state.bookmarks);
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    setTimeout(function () {
      addRecipeViewer.toogleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    addRecipeViewer.renderError(err.message);
  }
};
const init = function () {
  recipeViewer.addHandlerRender(controlRecipes);
  recipeViewer.addHandlerServings(controlServings);
  recipeViewer.addHandlerBookmark(controlAddBookmark);
  searchViewer.addHandlerSearch(controlSearch);
  pagginationViewer.addHandlerClick(controlPaggination);
  bookmarksViewer.addHandlerBookmarks(controlBookmarks);
  addRecipeViewer.addHandlerUpload(controlAddRecipe);
};
init();

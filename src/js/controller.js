// CONTROLLER MAINLY DEALS WITH CONTROL LOGIC

// architecture imports
import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchViews.js';
import resultsView from './views/resultsView.js';
import paginationview from './views/paginationview.js';
import bookmarkView from './views/bookmarksview.js';
import addRecipeView from './views/addRecipeView.js';
import { MODAL_CLOSE_SEC } from './config.js';

// imports for parcel
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import bookmarksview from './views/bookmarksview.js';
const recipeContainer = document.querySelector('.recipe');

// if (module.hot) {
//   module.hot.accept();
// }

const controlRecipe = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    recipeView.renderSpinner();

    // 0. update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage(1));
    bookmarksview.update(model.state.bookmarks);

    // 1. loading recipe
    await model.loadRecipe(id);

    // 2. rendering recipe;
    recipeView.render(model.state.recipe);

    // 3. rendering bookmark
    bookmarkView.render(model.state.bookmarks);
  } catch (err) {
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();
    console.log(resultsView);

    // 1. set search query
    const query = searchView.getQuery();
    if (!query) return;

    // 2. load search result
    await model.loadSearchResults(query);

    // 3. render search result
    console.log(model.state.search.result);
    resultsView.render(model.getSearchResultsPage());

    // 4. render initial pagination button
    paginationview.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (gotoPage) {
  // 1. render new result
  resultsView.render(model.getSearchResultsPage(gotoPage));

  // 2. render new pagination button
  paginationview.render(model.state.search);
};

const controlServings = function (updateTo) {
  // update the recipe controlServings(un state)
  model.updateServings(updateTo);

  // update the recipe view;
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // 1. add or remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  //2.update recipe view
  recipeView.update(model.state.recipe);

  // 3.render bookmarks
  bookmarkView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // show loading spinner
    addRecipeView.renderSpinner();

    // upload the new recipe data
    await model.uploadrecipe(newRecipe);

    // render recipe
    recipeView.render(model.state.recipe);

    // success message
    addRecipeView.renderMessage();

    // render bookmark view
    bookmarksview.render(model.state.bookmarks);

    // change ID in Url
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // close form window
    setTimeout(function () {
      addRecipeView._toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    addRecipeView.renderError(err.message);
  }
};

const init = function () {
  bookmarkView.render(model.state.bookmarks);
  recipeView.addHandlerRender(controlRecipe);
  searchView.addHandlerSearch(controlSearchResults);
  paginationview.addHandlerClick(controlPagination);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerBookmark(controlAddBookmark);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();

// //////////////////////////////////////
// testig

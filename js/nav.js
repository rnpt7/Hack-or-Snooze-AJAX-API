"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".nav-main").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}

/** Show story submit form on submit click */

function navSubmitClick(evt) {
  console.debug("navSubmitClick", evt);
  hidePageComponents();
  $submitForm.show();
  $allStoriesList.show();
}

$navSubmit.on("click", navSubmitClick);

/** Show favorite stories on favorites click */

function navFavoritesClick(evt) {
  console.debug("navFavoritesClick", evt);
  hidePageComponents();
  displayFavorites();
}

$navFavorites.on("click", navFavoritesClick);

/** Show own stories on my stories click */

function navOwnStoriesClick(evt) {
  console.debug("navOwnStoriesClick");
  hidePageComponents();
  displayOwnStories();
}

$navMyStories.on("click", navOwnStoriesClick);

/** Display user's profile on username click */
function navUserClick(evt) {
  console.debug("navUserClick", evt);
  hidePageComponents();
  $userProfile.show();
}

$navUserProfile.on("click", navUserClick);

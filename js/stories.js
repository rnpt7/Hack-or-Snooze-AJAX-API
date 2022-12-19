"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story, displayTrash) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();

  const displayStar = Boolean(currentUser);
  return $(`
      <li id="${story.storyId}">
        ${displayStar ? makeStar(story, currentUser) : ""}
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        ${displayTrash ? makeTrash() : ""}
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

/** Submit new story form on submit click */

async function submitNewStory(evt) {
  console.debug("submitNewStory");
  evt.preventDefault();

  const title = $("#make-title").val();
  const author = $("#make-author").val();
  const url = $("#make-url").val();
  const username = currentUser.username;
  const storyInfo = { title, author, url, username };

  const story = await storyList.addStory(currentUser, storyInfo);
  const $story = generateStoryMarkup(story);
  $allStoriesList.prepend($story);

  $submitForm.hide();
  $submitForm.trigger("reset");
}

$submitForm.on("submit", submitNewStory);

/** Make favoriting star */

function makeStar(story, user) {
  const checkFavorite = user.checkFavorite(story);
  const star = checkFavorite ? "fas" : "far";
  return `<span class="star">
            <i class="${star} fa-star"></i>
          </span>`;
}

/** Favorite and unfavorite a story */

async function toggleFavorite(evt) {
  console.debug("toggleFavorite");

  const $li = $(evt.target).closest("li");
  const storyId = $li.attr("id");
  const story = storyList.stories.find((s) => s.storyId === storyId);

  if ($(evt.target).hasClass("fas")) {
    await currentUser.removeFavorite(story);
    $(evt.target).closest("i").toggleClass("fas far");
  } else {
    await currentUser.addFavorite(story);
    $(evt.target).closest("i").toggleClass("fas far");
  }
}

$storyLists.on("click", ".star", toggleFavorite);

/** Show favorites list */

function displayFavorites() {
  console.debug("displayFavorites");

  $favoriteStories.empty();

  if (currentUser.favorites.length === 0) {
    $favoriteStories.append("<h5>Add some favorites first!</h5>");
  } else {
    for (let story of currentUser.favorites) {
      const $story = generateStoryMarkup(story);
      $favoriteStories.append($story);
    }
  }
  $favoriteStories.show();
}

/** Make delete trash icon */

function makeTrash() {
  return `<span class="trash">
            <i class="fas fa-trash"></i>
          </span>`;
}

/** Delete a story */

async function deleteStory(evt) {
  console.debug("deleteStory");

  const $li = $(evt.target).closest("li");
  const storyId = $li.attr("id");

  await storyList.removeStory(currentUser, storyId);
  await displayOwnStories();
}

$ownStories.on("click", ".trash", deleteStory);

/** Display own stories */

function displayOwnStories() {
  console.debug("displayOwnStories");

  $ownStories.empty();

  if (currentUser.ownStories.length === 0) {
    $ownStories.append("<h5>Add some stories first!</h5>");
  } else {
    for (let story of currentUser.ownStories) {
      let $story = generateStoryMarkup(story, true);
      $ownStories.append($story);
    }
  }
  $ownStories.show();
}

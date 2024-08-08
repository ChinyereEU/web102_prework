/*****************************************************************************
 * Challenge 2: Review the provided code. The provided code includes:
 * -> Statements that import data from games.js
 * -> A function that deletes all child elements from a parent element in the DOM
*/

// import the JSON data about the crowd funded games from the games.js file
import games from './games.js';
import GAMES_DATA from './games.js';

// create a list of objects to store the data about the games using JSON.parse
const GAMES_JSON = JSON.parse(GAMES_DATA)

// remove all child elements from a parent element in the DOM
function deleteChildElements(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

/*****************************************************************************
 * Challenge 3: Add data about each game as a card to the games-container
 * Skills used: DOM manipulation, for loops, template literals, functions
*/

// grab the element with the id games-container
const gamesContainer = document.getElementById("games-container");

// create a function that adds all data from the games array to the page
function addGamesToPage(games) {

    // loop over each item in the data
    games.forEach((games) => {
        // create a new div element, which will become the game card
        const div = document.createElement("div");
        // add the class game-card to the list
        div.classList.add("game-card");

        // set the inner HTML using a template literal to display some info about each game
        // TIP: if your images are not displaying, make sure there is space between the end of the src attribute and the end of the tag ("/>")
        
        div.innerHTML = `
            <div class="game-img">
                <img src=${games.img} />
            </div>
            <b> ${games.name}</b>
            <p> ${games.description}</p>
            <p> Backers: ${games.backers}</p>`;
            
        // append the game to the games-container
        gamesContainer.appendChild(div);
    })
}

// call the function we just defined using the correct variable
// later, we'll call this function using a different list of games
addGamesToPage(GAMES_JSON);

/*************************************************************************************
 * Challenge 4: Create the summary statistics at the top of the page displaying the
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: arrow functions, reduce, template literals
*/

// grab the contributions card element
const contributionsCard = document.getElementById("num-contributions");

// use reduce() to count the number of total contributions by summing the backers
const totalContributions = GAMES_JSON.reduce((accumulator, games) => {
    return accumulator + games.backers;
}, 0);
// console.log(totalContributions); //19187

// set the inner HTML using a template literal and toLocaleString to get a number with commas
const formattedTotalContributions = totalContributions.toLocaleString();
contributionsCard.innerHTML = `
    ${formattedTotalContributions}`;

// grab the amount raised card, then use reduce() to find the total amount raised
const raisedCard = document.getElementById("total-raised");

const totalRaised = GAMES_JSON.reduce((accumulator, games) => {
    return accumulator + games.pledged;
}, 0);

// set inner HTML using template literal
const formattedTotalRaised = totalRaised.toLocaleString();
raisedCard.innerHTML = `
    $${formattedTotalRaised}`;

// grab number of games card and set its inner HTML
const gamesCard = document.getElementById("num-games");
const numGames = GAMES_JSON.reduce((count, games) => {
    return count + 1;
}, 0);

gamesCard.innerHTML = `
    ${numGames}`;


/*************************************************************************************
 * Challenge 5: Add functions to filter the funded and unfunded games
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: functions, filter
*/

// show only games that do not yet have enough funding
function filterUnfundedOnly() {
    deleteChildElements(gamesContainer);

    // use filter() to get a list of games that have not yet met their goal
    let unfundedGames = GAMES_JSON.filter((games) => {
        return games.pledged < games.goal;
    });

    // use the function we previously created to add the unfunded games to the DOM
    addGamesToPage(unfundedGames);

    // to view array in console pt 1
    console.log(unfundedGames);
}
// to view array in console pt 2
filterUnfundedOnly();



// show only games that are fully funded
function filterFundedOnly() {
    deleteChildElements(gamesContainer);

    // use filter() to get a list of games that have met or exceeded their goal
    let fundedGames = GAMES_JSON.filter((games) => {
        return games.pledged >= games.goal;
    });

    // use the function we previously created to add unfunded games to the DOM
    addGamesToPage(fundedGames);
     // to view array in console pt 1
    console.log(fundedGames);
}
 // to view array in console pt 2
filterFundedOnly();

// show all games
function showAllGames() {
    deleteChildElements(gamesContainer);

    // add all games from the JSON data to the DOM
    addGamesToPage(GAMES_JSON);
}

// select each button in the "Our Games" section
const unfundedBtn = document.getElementById("unfunded-btn");
const fundedBtn = document.getElementById("funded-btn");
const allBtn = document.getElementById("all-btn");

// add event listeners with the correct functions to each button
unfundedBtn.addEventListener("click", filterUnfundedOnly);
fundedBtn.addEventListener("click", filterFundedOnly);
allBtn.addEventListener("click", showAllGames);

/*************************************************************************************
 * Challenge 6: Add more information at the top of the page about the company.
 * Skills used: template literals, ternary operator
*/

// grab the description container
const descriptionContainer = document.getElementById("description-container");

// use filter or reduce to count the number of unfunded games
const numUnfundedGames = GAMES_JSON.reduce((accumulator, games) => {
    return games.pledged < games.goal ? accumulator + 1 : accumulator;
}, 0);

const numFundedGames = GAMES_JSON.reduce((accumulator, games) => {
    return games.pledged >= games.goal ? accumulator + 1 : accumulator;
}, 0);


// create a string that explains the number of unfunded games using the ternary operator
let Unfundedstr = `A total of $${totalRaised} has been raised for ${numFundedGames > 1 ? numFundedGames + "games" : numFundedGames === 1 ? "1 game" : "no games"}. Currently, ${numUnfundedGames === 1 ? numUnfundedGames.toLocaleString() + "game" : numUnfundedGames > 1 ? numUnfundedGames + "games" : "no games"} remains unfunded. We need your help to fund these amazing games!`;

// create a new DOM element containing the template string and append it to the description container
const paragraph = document.createElement("p");
paragraph.innerHTML = Unfundedstr;
descriptionContainer.appendChild(paragraph);
/************************************************************************************
 * Challenge 7: Select & display the top 2 games
 * Skills used: spread operator, destructuring, template literals, sort 
 */

const firstGameContainer = document.getElementById("first-game");
const secondGameContainer = document.getElementById("second-game");

const sortedGames =  GAMES_JSON.sort( (item1, item2) => {
    return item2.pledged - item1.pledged;
});

// use destructuring and the spread operator to grab the first and second games
const [firstGame, secondGame, ...rest] = sortedGames;

// create a new element to hold the name of the top pledge game, then append it to the correct element
// firstGameContainer.innerHTML = `
//     <h2>${firstGame.name}</h2>`;

const topPledgeGame = document.createElement("h2");
topPledgeGame.textContent = firstGame.name;
firstGameContainer.appendChild(topPledgeGame);

// do the same for the runner up item
// secondGameContainer.innerHTML =  `
//     <h2>${secondGame.name}</h2>`;

const runnerUp = document.createElement("h2");
runnerUp.textContent = secondGame.name;
secondGameContainer.appendChild(runnerUp);
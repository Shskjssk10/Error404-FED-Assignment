//clientid and client secret and urls
const clientID = "r3auekm7tcozzfu1pi7xpv2cl7kqzt";
const clientSecret = "6w7djtd2t5fqom1fy20yui0yh1ae4l";
let accessToken;
const authUrl = `https://id.twitch.tv/oauth2/token`;
const serverUrl = "http://localhost:1115/getGames";

fetch(authUrl, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    client_id: clientID,
    client_secret: clientSecret,
    grant_type: "client_credentials",
  }),
})
  .then((response) => response.json())
  .then((data) => {
    accessToken = data.access_token;
    //console.log("Access Token: ", accessToken);

    //request to your Node.js server
    fetch(serverUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        accessToken: accessToken,
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        console.log(response);
        //clear previous content
        const overallContainer = document.querySelector(".container");

        //loop through and create each card to display for each game
        for (var i = 0; i < response.length; i++) {
          const game = response[i];

          //create card container dynamically
          //create a new div element
          const cardContainer = document.createElement("div");
          cardContainer.classList.add("col-lg-4", "col-md-4", "col-sm-4","mb-4", "card-container")

          //title from igdb api
          const titleDiv = document.createElement("div");
          titleDiv.classList.add("second-tier-header", "game-title");
          titleDiv.textContent = game.name;
          cardContainer.appendChild(titleDiv);

          //content, will store summary
          const sumDiv = document.createElement("div");
          sumDiv.classList.add("text", "game-summary");

          //set summary else if game.summary is empty then show default text
          const summaryText = game.summary
            ? game.summary
            : "No additional info. Click to find out more.";
          //some summary too long so need to clip it and then only display full when user click show more
          const Summary =
            //check is > 150 char
            summaryText.length > 150
              ? summaryText.substring(0, 150) + "..."
              : summaryText;
              sumDiv.textContent = Summary;
          cardContainer.appendChild(sumDiv);

          //if more than 150 then let user decide is they want to click show more
          if (summaryText.length > 150) {
            const readMoreButton = document.createElement("button");
            readMoreButton.classList.add("text");
            readMoreButton.textContent = "Show More";
            readMoreButton.addEventListener("click", () => {
              if (sumDiv.textContent === Summary) {
                sumDiv.textContent = summaryText;
                readMoreButton.textContent = "Show Less";
              } else {
                sumDiv.textContent = Summary;
                readMoreButton.textContent = "Show More";
              }
            });
            cardContainer.appendChild(readMoreButton);
          }

          //button links to igdb website fot the specific game
          const buttonContainer = document.createElement("a");
          buttonContainer.href = game.url;
          const buttonText = document.createElement("div");
          buttonText.textContent = "Find Out More"
          buttonText.classList.add("button", "button-text", "find-out-more-button");

          buttonContainer.appendChild(buttonText);
          cardContainer.appendChild(buttonContainer);

          //append to card
          overallContainer.appendChild(cardContainer);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  })
  .catch((error) => {
    console.error("Error in obtaining access token: ", error);
  });
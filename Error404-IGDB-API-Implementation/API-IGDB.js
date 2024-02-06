//clientid and client secret and urls
const clientID = "r3auekm7tcozzfu1pi7xpv2cl7kqzt";
const clientSecret = "6w7djtd2t5fqom1fy20yui0yh1ae4l";
let accessToken;
const authUrl = `https://id.twitch.tv/oauth2/token`;
const serverUrl = "http://localhost:1010/getGames";

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
        cardContainer.innerHTML = "";

        //loop through and create each card to display for each game
        for (var i = 0; i < response.length; i++) {
          const game = response[i];

          //create bs card dynamically
          //create a new div element
          const cardDiv = document.createElement("div");
          cardDiv.classList.add("col-md-4", "mb-4");

          //create card
          const cardBodyDiv = document.createElement("div");
          cardBodyDiv.classList.add("card", "h-100");

          //title from igdb api
          const title = document.createElement("h5");
          title.classList.add("card-title");
          title.textContent = game.name;
          cardBodyDiv.appendChild(title);

          //content
          const contentDiv = document.createElement("div");
          contentDiv.classList.add("card-text");

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
          contentDiv.textContent = Summary;
          cardBodyDiv.appendChild(contentDiv);

          //if more than 150 then let user decide is they want to click show more
          if (summaryText.length > 150) {
            const readMoreButton = document.createElement("button");
            readMoreButton.classList.add("btn", "btn-link");
            readMoreButton.textContent = "Show More";
            readMoreButton.addEventListener("click", () => {
              if (contentDiv.textContent === Summary) {
                contentDiv.textContent = summaryText;
                readMoreButton.textContent = "Show Less";
              } else {
                contentDiv.textContent = Summary;
                readMoreButton.textContent = "Show More";
              }
            });
            cardBodyDiv.appendChild(readMoreButton);
          }

          //button links to igdb website fot the specific game
          const button = document.createElement("a");
          button.href = game.url;
          button.classList.add("btn", "btn-primary", "mt-auto");
          button.textContent = "Find Out More";
          cardBodyDiv.appendChild(button);

          //append to card
          cardDiv.appendChild(cardBodyDiv);
          cardContainer.appendChild(cardDiv);
        }

        cardContainer.classList.add("justify-content-around", "d-flex");
      })
      .catch((err) => {
        console.error(err);
      });
  })
  .catch((error) => {
    console.error("Error in obtaining access token: ", error);
  });

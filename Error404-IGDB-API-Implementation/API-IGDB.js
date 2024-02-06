const clientID = "r3auekm7tcozzfu1pi7xpv2cl7kqzt";
const clientSecret = "6w7djtd2t5fqom1fy20yui0yh1ae4l";
let accessToken;

const authUrl = `https://id.twitch.tv/oauth2/token`;
const serverUrl = "http://localhost:1010/getGames";

console.log(authUrl);

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
    console.log("Access Token: ", accessToken);

    // Now make a request to your Node.js server
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
        // Clear previous content
        cardContainer.innerHTML = "";

        for (var i = 0; i < response.length; i++) {
          const game = response[i];

          // Create Bootstrap card dynamically
          const cardDiv = document.createElement("div");
          cardDiv.classList.add("col-md-4", "mb-4"); // Bootstrap grid class and margin bottom class

          // Create card body
          const cardBodyDiv = document.createElement("div");
          cardBodyDiv.classList.add("card", "h-100");

          // Assign title and content from response
          const title = document.createElement("h5");
          title.classList.add("card-title");
          title.textContent = game.name; // Assuming response has a 'title' property
          cardBodyDiv.appendChild(title);

          const content = document.createElement("p");
          content.classList.add("card-text");
          content.textContent = game.summary; // Assuming response has a 'content' property
          cardBodyDiv.appendChild(content);

          // Create a button
          const button = document.createElement("a");
          button.href = game.url;
          button.classList.add("btn", "btn-primary");
          button.textContent = "Find Out More";
          cardBodyDiv.appendChild(button);

          // Append card body to card
          cardDiv.appendChild(cardBodyDiv);

          // Append card to the card container
          cardContainer.appendChild(cardDiv);
        }

        // Add Bootstrap classes for spacing around
        cardContainer.classList.add("justify-content-around", "d-flex");
      })
      .catch((err) => {
        console.error(err);
      });
  })
  .catch((error) => {
    console.error("Error in obtaining access token: ", error);
  });

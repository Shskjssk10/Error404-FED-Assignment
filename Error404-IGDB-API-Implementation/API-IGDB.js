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
      .then((data) => {
        console.log(data);
      })
      .catch((err) => {
        console.error(err);
      });
  })
  .catch((error) => {
    console.error("Error in obtaining access token: ", error);
  });

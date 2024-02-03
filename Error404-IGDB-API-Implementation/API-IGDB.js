const clientID = "r3auekm7tcozzfu1pi7xpv2cl7kqzt";
const clientSecret = "6w7djtd2t5fqom1fy20yui0yh1ae4l";
let accessToken;

const url = `https://id.twitch.tv/oauth2/token?client_id=${clientID}&client_secret=${clientSecret}&grant_type=client_credentials`;

console.log(url);
//console.log("OK");

fetch(url, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
})
  .then((response) => response.json())
  .then((data) => {
    accessToken = data.access_token;
    console.log("Access Token: ", accessToken);
  })
  .catch((error) => {});

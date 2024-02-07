document.addEventListener("DOMContentLoaded", function () {
  const APIKEY = "65b0b8899eb5badebb7fa256";
  console.log("DOM");
  let highScore = parseInt(localStorage.getItem("high-score")) || 0;
  console.log(typeof highScore);
  console.log(highScore);
  document.getElementById("submit").addEventListener("click", function (e) {
    e.preventDefault();

    let name = document.getElementById("username").value.trim();
    console.log(name);

    let jsondata = {
      name: name,
      highScore: highScore,
    };

    let settings = {
      async: true,
      crossDomain: true,
      url: "https://frontenddev-de90.restdb.io/rest/assignment2leaderboard",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-apikey": APIKEY,
        "cache-control": "no-cache",
      },
      body: JSON.stringify(jsondata),
    };

    fetch(
      "https://frontenddev-de90.restdb.io/rest/assignment2leaderboard",
      settings
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        document.getElementById("submit").disabled = false;
        getData();
      });
  });

  function getData(limit = 10, all = true) {
    let settings = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-apikey": APIKEY,
        "cache-control": "no-cache",
      },
    };

    fetch(
      "https://frontenddev-de90.restdb.io/rest/assignment2leaderboard",
      settings
    )
      .then((response) => response.json())
      .then((response) => {
        response.sort((a, b) => {
          if (a.score === b.score) {
            // If scores are equal, sort by name in reverse alphabetical order
            return b.name.localeCompare(a.name);
          }
          // Sort by score in descending order
          return b.score - a.score;
        });
        response = response.slice(0, 10);
        let content = "";
        let count = 1;
        for (var i = 0; i < response.length && i < limit; i++) {
          content += `<tr id='${response[i]._id}'>
            <td>${count++}</td>
            <td>${response[i].name}</td>
            <td>${response[i].score}</td>
            </tr>`;
        }
        document.getElementById("leaderboard").innerHTML = content;
      });
  }
});

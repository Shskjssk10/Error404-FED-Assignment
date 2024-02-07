document.addEventListener("DOMContentLoaded", function () {
  const APIKEY = "65b0b8899eb5badebb7fa256";
  const url = "https://frontenddev-de90.restdb.io/rest/assignment2leaderboard";
  const testAPIKEY = "65a3b91cc69bc811d2f5e22b";
  const testurl =
    "https://frontenddev-a33c.restdb.io/rest/assignment2leaderboard";
  getData();

  document.getElementById("submit").addEventListener("click", function (e) {
    e.preventDefault();

    let name = document.getElementById("username").value;
    let highScore = localStorage.getItem("high-score") || 0;

    let jsondata = {
      name: name,
      score: highScore,
    };

    let settings = {
      async: true,
      crossDomain: true,
      url: testurl,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-apikey": testAPIKEY,
        "cache-control": "no-cache",
      },
      body: JSON.stringify(jsondata),
    };

    fetch(testurl, settings)
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
        "x-apikey": testAPIKEY,
        "cache-control": "no-cache",
      },
    };

    fetch(testurl, settings)
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

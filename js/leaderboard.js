document.addEventListener("DOMContentLoaded", function () {
  const testurl = "https://feddddd-6882.restdb.io/rest/assignment2leaderboard";
  const testapikey = "65c4358c86354f3586464a0d";

  getData();

  document.getElementById("submit").addEventListener("click", function (e) {
    e.preventDefault();

    let name = document.getElementById("username").value;
    let highScore = localStorage.getItem("high-score");

    // Check if the user has entered a name and a score
    if (name && highScore > 0) {
      // Check and update high score if necessary
      getHighScore(name, highScore);

      // Reset local storage for high score only if it's a new name
      let existingData =
        JSON.parse(localStorage.getItem("high-score-data")) || {};
      if (!existingData[name]) {
        localStorage.removeItem("high-score");
      }

      let jsondata = {
        name: name,
        score: highScore,
      };

      let settings = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-apikey": testapikey,
          "cache-control": "no-cache",
        },
        body: JSON.stringify(jsondata),
      };

      fetch(testurl, settings)
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          document.getElementById("submit").disabled = false;
          // Refresh leaderboard after posting data
          getData();
        })
        .catch((error) => console.error("Error posting score: ", error));
    } else {
      // Handle case where user hasn't played the game yet
      console.log("Please play the game before submitting your score.");
    }
  });

  function getHighScore(name, highScore) {
    let settings = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-apikey": testapikey,
        "cache-control": "no-cache",
      },
    };

    fetch(testurl, settings)
      .then((response) => response.json())
      .then((data) => {
        const existingUser = data.find((user) => user.name === name);

        if (existingUser && highScore > existingUser.score) {
          let updateSetting = {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "x-apikey": testapikey,
              "cache-control": "no-cache",
            },
            body: JSON.stringify({ score: highScore }),
          };

          fetch(`${testurl}/${existingUser._id}`, updateSetting)
            .then((response) => response.json())
            .then((updatedData) => {
              console.log("Score updated in database: ", updatedData);
              getData();
            })
            .catch((error) => console.error("Error updating score: ", error))
            .then(() => {
              // Update leaderboard after score update
              getData();
            });
        }
      });
  }

  function getData(limit = 10) {
    let settings = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-apikey": testapikey,
        "cache-control": "no-cache",
      },
    };

    fetch(testurl, settings)
      .then((response) => response.json())
      .then((response) => {
        // Create a map to store unique users and their highest scores
        let userScoresMap = new Map();

        // Iterate through the response data to update the userScoresMap
        response.forEach((user) => {
          if (
            !userScoresMap.has(user.name) ||
            userScoresMap.get(user.name) < user.score
          ) {
            userScoresMap.set(user.name, user.score);
          }
        });

        // Convert the map back to an array of objects
        let uniqueUserScores = Array.from(userScoresMap, ([name, score]) => ({
          name,
          score,
        }));

        // Sort the uniqueUserScores array by score in descending order
        uniqueUserScores.sort((a, b) => b.score - a.score);

        // Create HTML content for leaderboard
        let content = "";
        let count = 1;
        for (let i = 0; i < uniqueUserScores.length && i < limit; i++) {
          content += `<tr class="leaderboard-row"> 
              <td>${count++}</td> 
              <td>${uniqueUserScores[i].name}</td> 
              <td>${uniqueUserScores[i].score}</td> 
              </tr>`;
        }
        document.getElementById("leaderboard").innerHTML = content;
      });
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const APIKEY = "65b0b8899eb5badebb7fa256";

  document.getElementById("submit").addEventListener("click", function (e) {
    e.preventDefault();

    let name = document.getElementById("name").value;
    let feedback = document.getElementById("feedback").value;
    console.log(name);
    console.log(feedback);

    let jsonData = {
      name: name,
      feedback: feedback,
    };

    console.log(jsonData);

    let settings = {
      async: true,
      crossDomain: true,
      url: "https://frontenddev-de90.restdb.io/rest/assignment2feedback",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-apikey": APIKEY,
        "cache-control": "no-cache",
      },
      body: JSON.stringify(jsonData), // Changed jsondata to jsonData
    };

    fetch(
      "https://frontenddev-de90.restdb.io/rest/assignment2feedback",
      settings
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        document.getElementById("submit").disabled = false;
      });
  });
});

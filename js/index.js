document.addEventListener('DOMContentLoaded', function () {
    // Event listener for search button
    document.querySelector('.search-button').addEventListener('click', filterGames);
  
    function filterGames() {
      var category = document.querySelector('.dropdown-filter').value.toLowerCase();
      var search = document.querySelector('#search').value.toLowerCase();
  
      var rows = document.querySelectorAll('.row');
      rows.forEach(function (row) {
        var rowCategory = row.dataset.category.toLowerCase();
        var rowName = row.querySelector('.second-tier-header').textContent.toLowerCase();
  
        var categoryMatch = (category === 'both' || rowCategory === category);
        var searchMatch = (rowName.includes(search));
  
        if (categoryMatch && searchMatch) {
          row.style.display = 'flex';
        } else {
          row.style.display = 'none';
        }
      });
    }
  });
  
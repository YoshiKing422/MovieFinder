const API_KEY = "..."; // <-- put your OMDb key here

// ---------------------
// AUTOCOMPLETE FUNCTION
// ---------------------
let typingTimer;
async function autocomplete() {
  clearTimeout(typingTimer);
  typingTimer = setTimeout(runAutocomplete, 250); // small delay to avoid spam
}

async function runAutocomplete() {
  const query = document.getElementById("searchInput").value.trim();
  const suggestionsDiv = document.getElementById("suggestions");

  if (query.length < 2) {
    suggestionsDiv.innerHTML = "";
    return;
  }

  const url = `https://www.omdbapi.com/?apikey=${API_KEY}&s=${query}`;
  const res = await fetch(url);
  const data = await res.json();

  suggestionsDiv.innerHTML = "";

  if (data.Response === "False") return;

  data.Search.slice(0, 6).forEach(movie => {
    const item = document.createElement("div");
    item.classList.add("suggestion-item");
    item.textContent = movie.Title + " (" + movie.Year + ")";

    // When clicking a suggestion
    item.onclick = () => {
      document.getElementById("searchInput").value = movie.Title;
      suggestionsDiv.innerHTML = "";
      searchMovies();
    };

    suggestionsDiv.appendChild(item);
  });
}

// ---------------------
// SEARCH MOVIES
// ---------------------
async function searchMovies() {
  const query = document.getElementById("searchInput").value.trim();
  const resultsDiv = document.getElementById("results");
  const suggestionsDiv = document.getElementById("suggestions");

  suggestionsDiv.innerHTML = ""; // hide suggestions after searching

  if (!query) return;

  const url = `https://www.omdbapi.com/?apikey=${API_KEY}&s=${query}`;
  const res = await fetch(url);
  const data = await res.json();

  resultsDiv.innerHTML = "";

  if (data.Response === "False") {
    resultsDiv.innerHTML = `<p>No results found.</p>`;
    return;
  }

  data.Search.forEach(movie => {
    resultsDiv.innerHTML += `
      <div class="movie" onclick="showDetails('${movie.imdbID}')">
        <img src="${movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/200'}" />
        <h3>${movie.Title}</h3>
        <p>${movie.Year}</p>
      </div>
    `;
  });
}

// ---------------------
// SHOW FULL DETAILS
// ---------------------
async function showDetails(id) {
  const url = `https://www.omdbapi.com/?apikey=${API_KEY}&i=${id}&plot=full`;
  const res = await fetch(url);
  const movie = await res.json();

  if (movie.Response === "False") {
    alert("Movie details not found.");
    return;
  }

  const rated = movie.Rated || "N/A";
  const runtime = movie.Runtime || "N/A";
  const awards = movie.Awards || "N/A";
  const imdbRating = movie.imdbRating || "N/A";
  const rtRating = (movie.Ratings || []).find(r => r.Source === "Rotten Tomatoes")?.Value || "N/A";

  alert(`
${movie.Title || 'Unknown Title'} (${movie.Year || 'N/A'})

Rated: ${rated}
Runtime: ${runtime}
Awards: ${awards}

IMDB Rating: ${imdbRating}
Rotten Tomatoes: ${rtRating}
Genre: ${movie.Genre || 'N/A'}
Director: ${movie.Director || 'N/A'}

Plot:
${movie.Plot || 'N/A'}
  `);
}

document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('searchInput');
  if (!input) return;

  // run autocomplete while typing (debounced inside autocomplete)

  // run autocomplete while typing (debounced inside autocomplete)
  input.addEventListener('input', autocomplete);

  // pressing Enter triggers search
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      searchMovies();
    }
  });

  //  hide suggestions when clicking outside
  document.addEventListener('click', (e) => {
    const suggestions = document.getElementById('suggestions');
    if (!suggestions) return;
    if (!suggestions.contains(e.target) && e.target !== input) {
      suggestions.innerHTML = '';
    }
  });
});


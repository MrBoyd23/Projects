import React, { useState, useEffect, useCallback } from 'react';

// Constants for API
const API_KEY = '3465863de86bd626874e9db8a6286623';
const ACCESS_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzNDY1ODYzZGU4NmJkNjI2ODc0ZTlkYjhhNjI4NjYyMyIsIm5iZiI6MTcyMjAyOTIzNi4wMzQ0MDcsInN1YiI6IjY2YTQxM2RhODQwYzRiMDU4OTc2Njc1YSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Fo8FaKSTktFYFgo0V6KDwf41l6hmN0jggCdsgpeF5LQ';

// SearchBar Component
const SearchBar = ({ onSearch, onClear, onCategoryChange, selectedCategory }) => {
  const [query, setQuery] = useState('');
  
  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(query, selectedCategory);
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search for Movies or TV shows"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ fontSize: '1.2em', padding: '10px', width: '80%', maxWidth: '600px' }}
        />
        <button type="submit" style={{ padding: '10px', marginLeft: '10px' }}>Search</button>
        <button type="button" onClick={onClear} style={{ padding: '10px', marginLeft: '10px' }}>Clear</button>
      </form>
      <div style={{ marginTop: '10px' }}>
        <input
          type="radio"
          id="movies"
          name="category"
          value="movie"
          checked={selectedCategory === 'movie'}
          onChange={() => onCategoryChange('movie')}
        />
        <label htmlFor="movies">Movies</label>
        <input
          type="radio"
          id="tv"
          name="category"
          value="tv"
          checked={selectedCategory === 'tv'}
          onChange={() => onCategoryChange('tv')}
        />
        <label htmlFor="tv">TV Shows</label>
        <input
          type="radio"
          id="actors"
          name="category"
          value="actor"
          checked={selectedCategory === 'actor'}
          onChange={() => onCategoryChange('actor')}
        />
        <label htmlFor="actors">Actors</label>
      </div>
    </div>
  );
};

// TheMovieDBTopMovies Component
const TheMovieDBTopMovies = ({ searchQuery }) => {
  const [movies, setMovies] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [moviesPerPage] = useState(5);
  const [errorMessage, setErrorMessage] = useState('');

  const fetchMovies = useCallback(async () => {
    try {
      const response = await fetch(`https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          'Content-Type': 'application/json;charset=utf-8'
        },
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      if (data.errors) {
        setErrorMessage(data.errors.join(', '));
      } else {
        setMovies(data.results);
        setSearchResults(data.results);
      }
    } catch (error) {
      console.error('Error fetching movies:', error);
      setErrorMessage('An error occurred while fetching movie data.');
    }
  }, []);

  const handleSearch = useCallback(async (query) => {
    try {
      const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${query}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          'Content-Type': 'application/json;charset=utf-8'
        },
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      if (data.errors) {
        setErrorMessage(data.errors.join(', '));
      } else {
        setSearchResults(data.results);
      }
    } catch (error) {
      console.error('Error searching movies:', error);
      setErrorMessage('An error occurred while searching for movies.');
    }
  }, []);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  useEffect(() => {
    if (!searchQuery) {
      setSearchResults(movies);
    } else {
      handleSearch(searchQuery);
    }
  }, [searchQuery, movies, handleSearch]);

  const indexOfLastMovie = currentPage * moviesPerPage;
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
  const currentMovies = searchResults.slice(indexOfFirstMovie, indexOfLastMovie);

  const paginate = pageNumber => setCurrentPage(pageNumber);

  return (
    <div style={{ marginTop: '20px' }}>
      {searchQuery && <h2>Search Results for Movies</h2>}
      {searchQuery && searchResults.length === 0 && <p>No results found.</p>}
      {!searchQuery && <h2>Top Rated Movies</h2>}
      {errorMessage ? (
        <div style={{ color: 'red' }}>
          <p>{errorMessage}</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
          {currentMovies.map((movie) => (
            <div key={movie.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '200px' }}>
              <img src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} alt={movie.title} style={{ width: '100%', marginBottom: '10px' }} />
              <div style={{ textAlign: 'center', color: 'white' }}>
                <h3 style={{ margin: '0' }}>
                  {movie.title}
                  <span style={{ fontSize: '0.9em', color: '#ccc' }}>
                    {' '}| Rating: {movie.vote_average} | Year: {new Date(movie.release_date).getFullYear()} |{' '}
                    <a href={`https://www.themoviedb.org/movie/${movie.id}`} target="_blank" rel="noopener noreferrer" style={{ color: '#8b0000', textDecoration: 'none' }}>
                      TMDB Link
                    </a>
                  </span>
                </h3>
                <p style={{ fontSize: '0.9em', color: '#ccc', marginTop: '5px' }}>{movie.overview}</p>
                <p style={{ fontSize: '0.9em', color: '#ccc', marginTop: '5px' }}>
                  Certification: {movie.certification || 'N/A'}
                </p>
                <p style={{ fontSize: '0.9em', color: '#ccc', marginTop: '5px' }}>
                  Top Billed Actors: {movie.actors?.join(', ') || 'N/A'}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
      {!searchQuery && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
          {Array.from({ length: Math.ceil(movies.length / moviesPerPage) }, (_, index) => (
            <button key={index + 1} onClick={() => paginate(index + 1)} style={{ margin: '0 5px' }}>
              {index + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// TheMovieDBTopTVShows Component
const TheMovieDBTopTVShows = ({ searchQuery }) => {
  const [tvShows, setTvShows] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [tvShowsPerPage] = useState(5);
  const [errorMessage, setErrorMessage] = useState('');

  const fetchTvShows = useCallback(async () => {
    try {
      const response = await fetch(`https://api.themoviedb.org/3/tv/top_rated?api_key=${API_KEY}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          'Content-Type': 'application/json;charset=utf-8'
        },
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      if (data.errors) {
        setErrorMessage(data.errors.join(', '));
      } else {
        setTvShows(data.results);
        setSearchResults(data.results);
      }
    } catch (error) {
      console.error('Error fetching TV shows:', error);
      setErrorMessage('An error occurred while fetching TV show data.');
    }
  }, []);

  const handleSearch = useCallback(async (query) => {
    try {
      const response = await fetch(`https://api.themoviedb.org/3/search/tv?api_key=${API_KEY}&query=${query}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          'Content-Type': 'application/json;charset=utf-8'
        },
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      if (data.errors) {
        setErrorMessage(data.errors.join(', '));
      } else {
        setSearchResults(data.results);
      }
    } catch (error) {
      console.error('Error searching TV shows:', error);
      setErrorMessage('An error occurred while searching for TV shows.');
    }
  }, []);

  useEffect(() => {
    fetchTvShows();
  }, [fetchTvShows]);

  useEffect(() => {
    if (!searchQuery) {
      setSearchResults(tvShows);
    } else {
      handleSearch(searchQuery);
    }
  }, [searchQuery, tvShows, handleSearch]);

  const indexOfLastShow = currentPage * tvShowsPerPage;
  const indexOfFirstShow = indexOfLastShow - tvShowsPerPage;
  const currentTvShows = searchResults.slice(indexOfFirstShow, indexOfLastShow);

  const paginate = pageNumber => setCurrentPage(pageNumber);

  return (
    <div style={{ marginTop: '20px' }}>
      {searchQuery && <h2>Search Results for TV Shows</h2>}
      {searchQuery && searchResults.length === 0 && <p>No results found.</p>}
      {!searchQuery && <h2>Top Rated TV Shows</h2>}
      {errorMessage ? (
        <div style={{ color: 'red' }}>
          <p>{errorMessage}</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
          {currentTvShows.map((show) => (
            <div key={show.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '200px' }}>
              <img src={`https://image.tmdb.org/t/p/w200${show.poster_path}`} alt={show.name} style={{ width: '100%', marginBottom: '10px' }} />
              <div style={{ textAlign: 'center', color: 'white' }}>
                <h3 style={{ margin: '0' }}>
                  {show.name}
                  <span style={{ fontSize: '0.9em', color: '#ccc' }}>
                    {' '}| Rating: {show.vote_average} | Year: {new Date(show.first_air_date).getFullYear()} |{' '}
                    <a href={`https://www.themoviedb.org/tv/${show.id}`} target="_blank" rel="noopener noreferrer" style={{ color: '#8b0000', textDecoration: 'none' }}>
                      TMDB Link
                    </a>
                  </span>
                </h3>
                <p style={{ fontSize: '0.9em', color: '#ccc', marginTop: '5px' }}>{show.overview}</p>
                <p style={{ fontSize: '0.9em', color: '#ccc', marginTop: '5px' }}>
                  Certification: {show.certification || 'N/A'}
                </p>
                <p style={{ fontSize: '0.9em', color: '#ccc', marginTop: '5px' }}>
                  Top Billed Actors: {show.actors?.join(', ') || 'N/A'}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
      {!searchQuery && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
          {Array.from({ length: Math.ceil(tvShows.length / tvShowsPerPage) }, (_, index) => (
            <button key={index + 1} onClick={() => paginate(index + 1)} style={{ margin: '0 5px' }}>
              {index + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// TheMovieDBTopActors Component
const TheMovieDBTopActors = ({ searchQuery, onActorClick }) => {
  const [actors, setActors] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [actorsPerPage] = useState(5);
  const [errorMessage, setErrorMessage] = useState('');

  const fetchActors = useCallback(async () => {
    try {
      const response = await fetch(`https://api.themoviedb.org/3/person/popular?api_key=${API_KEY}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          'Content-Type': 'application/json;charset=utf-8'
        },
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      if (data.errors) {
        setErrorMessage(data.errors.join(', '));
      } else {
        setActors(data.results);
        setSearchResults(data.results);
      }
    } catch (error) {
      console.error('Error fetching actors:', error);
      setErrorMessage('An error occurred while fetching actor data.');
    }
  }, []);

  const handleSearch = useCallback(async (query) => {
    try {
      const response = await fetch(`https://api.themoviedb.org/3/search/person?api_key=${API_KEY}&query=${query}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          'Content-Type': 'application/json;charset=utf-8'
        },
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      if (data.errors) {
        setErrorMessage(data.errors.join(', '));
      } else {
        setSearchResults(data.results);
      }
    } catch (error) {
      console.error('Error searching actors:', error);
      setErrorMessage('An error occurred while searching for actors.');
    }
  }, []);

  useEffect(() => {
    fetchActors();
  }, [fetchActors]);

  useEffect(() => {
    if (!searchQuery) {
      setSearchResults(actors);
    } else {
      handleSearch(searchQuery);
    }
  }, [searchQuery, actors, handleSearch]);

  const indexOfLastActor = currentPage * actorsPerPage;
  const indexOfFirstActor = indexOfLastActor - actorsPerPage;
  const currentActors = searchResults.slice(indexOfFirstActor, indexOfLastActor);

  const paginate = pageNumber => setCurrentPage(pageNumber);

  const handleActorClick = async (actorId) => {
    try {
      const response = await fetch(`https://api.themoviedb.org/3/person/${actorId}/combined_credits?api_key=${API_KEY}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          'Content-Type': 'application/json;charset=utf-8'
        },
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      if (data.errors) {
        setErrorMessage(data.errors.join(', '));
      } else {
        onActorClick(data.cast); // Pass the top 10 movies or TV shows to the parent component
      }
    } catch (error) {
      console.error('Error fetching actor details:', error);
      setErrorMessage('An error occurred while fetching actor details.');
    }
  };

  return (
    <div style={{ marginTop: '20px' }}>
      {searchQuery && <h2>Search Results for Actors</h2>}
      {searchQuery && searchResults.length === 0 && <p>No results found.</p>}
      {!searchQuery && <h2>Top Rated Actors</h2>}
      {errorMessage ? (
        <div style={{ color: 'red' }}>
          <p>{errorMessage}</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
          {currentActors.map((actor) => (
            <div key={actor.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '200px' }}>
              <img
                src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`}
                alt={actor.name}
                style={{ width: '100%', cursor: 'pointer', marginBottom: '10px' }}
                onClick={() => handleActorClick(actor.id)}
              />
              <div style={{ textAlign: 'center', color: 'white' }}>
                <h3 style={{ margin: '0' }}>
                  {actor.name}
                </h3>
              </div>
            </div>
          ))}
        </div>
      )}
      {!searchQuery && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
          {Array.from({ length: Math.ceil(actors.length / actorsPerPage) }, (_, index) => (
            <button key={index + 1} onClick={() => paginate(index + 1)} style={{ margin: '0 5px' }}>
              {index + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// Main App Component
const App = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('movie');
  const [actorTopMovies, setActorTopMovies] = useState([]);

  const handleSearch = (query, category) => {
    setSearchQuery(query);
    setSelectedCategory(category);
  };

  const handleClear = () => {
    setSearchQuery('');
    setSelectedCategory('movie');
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setSearchQuery('');
  };

  const handleActorClick = (topMovies) => {
    setActorTopMovies(topMovies.slice(0, 12)); // Set top 12 movies or TV shows
  };

  return (
    <div style={{ backgroundColor: '#000', color: '#fff', minHeight: '100vh', padding: '20px' }}>
      <SearchBar onSearch={handleSearch} onClear={handleClear} onCategoryChange={handleCategoryChange} selectedCategory={selectedCategory} />
      {selectedCategory === 'movie' && <TheMovieDBTopMovies searchQuery={searchQuery} />}
      {selectedCategory === 'tv' && <TheMovieDBTopTVShows searchQuery={searchQuery} />}
      {selectedCategory === 'actor' && <TheMovieDBTopActors searchQuery={searchQuery} onActorClick={handleActorClick} />}
      {actorTopMovies.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <h2>Top Movies or TV Shows for Selected Actor</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
            {actorTopMovies.map((item) => (
              <div key={item.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '200px' }}>
                <img src={`https://image.tmdb.org/t/p/w200${item.poster_path}`} alt={item.title || item.name} style={{ width: '100%', marginBottom: '10px' }} />
                <div style={{ textAlign: 'center', color: 'white' }}>
                  <h3 style={{ margin: '0' }}>
                    {item.title || item.name}
                    <span style={{ fontSize: '0.9em', color: '#ccc' }}>
                      {' '}| Rating: {item.vote_average} | Year: {item.release_date ? new Date(item.release_date).getFullYear() : 'N/A'} |{' '}
                      <a href={`https://www.themoviedb.org/${item.media_type}/${item.id}`} target="_blank" rel="noopener noreferrer" style={{ color: '#8b0000', textDecoration: 'none' }}>
                        TMDB Link
                      </a>
                    </span>
                  </h3>
                  <p style={{ fontSize: '0.9em', color: '#ccc', marginTop: '5px' }}>
                    Description: {item.overview || 'N/A'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;


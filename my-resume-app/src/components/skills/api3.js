import React, { useState, useEffect, useCallback } from 'react';

// API credentials loaded from environment variables (never hardcode secrets)
const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
const ACCESS_TOKEN = process.env.REACT_APP_TMDB_ACCESS_TOKEN;

// ── Shared style helpers ──────────────────────────────────────────────

const ratingBadgeColor = (score) => {
  if (score >= 7) return '#2e7d32';
  if (score >= 5) return '#f9a825';
  return '#c62828';
};

const cardStyle = {
  backgroundColor: '#0d0d0d',
  border: '1px solid #1e1e1e',
  borderTop: '3px solid #8b0000',
  borderRadius: '10px',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  transition: 'box-shadow 0.25s ease, transform 0.25s ease',
};

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
  gap: '16px',
};

const sectionHeadingStyle = {
  fontFamily: "'Playfair Display', serif",
  fontSize: '1.6rem',
  color: '#fff',
  borderBottom: '2px solid #8b0000',
  paddingBottom: '8px',
  marginBottom: '20px',
};

const errorBoxStyle = {
  backgroundColor: 'rgba(139,0,0,0.15)',
  border: '1px solid #8b0000',
  borderRadius: '8px',
  padding: '16px 20px',
  color: '#ff6b6b',
  fontFamily: "'Poppins', sans-serif",
  fontSize: '0.95rem',
};

const paginationBtnBase = {
  padding: '6px 14px',
  margin: '0 3px',
  border: '1px solid #1e1e1e',
  borderRadius: '6px',
  cursor: 'pointer',
  fontFamily: "'Poppins', sans-serif",
  fontSize: '0.85rem',
  transition: 'background-color 0.2s ease, color 0.2s ease',
};

const paginationBtn = (isActive) => ({
  ...paginationBtnBase,
  backgroundColor: isActive ? '#8b0000' : '#0d0d0d',
  color: isActive ? '#fff' : '#aaa',
});

// SearchBar Component
const SearchBar = ({ onSearch, onClear, onCategoryChange, selectedCategory }) => {
  const [query, setQuery] = useState('');
  const [inputFocused, setInputFocused] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(query, selectedCategory);
  };

  const pillStyle = (active) => ({
    padding: '8px 22px',
    border: 'none',
    borderRadius: '999px',
    cursor: 'pointer',
    fontFamily: "'Poppins', sans-serif",
    fontSize: '0.85rem',
    fontWeight: active ? 600 : 400,
    backgroundColor: active ? '#8b0000' : '#1a1a1a',
    color: active ? '#fff' : '#aaa',
    transition: 'background-color 0.2s ease, color 0.2s ease',
    outline: 'none',
  });

  const actionBtnStyle = (variant) => ({
    padding: '12px 28px',
    marginLeft: '8px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontFamily: "'Poppins', sans-serif",
    fontSize: '0.95rem',
    fontWeight: 600,
    backgroundColor: variant === 'primary' ? '#8b0000' : '#1a1a1a',
    color: '#fff',
    transition: 'background-color 0.2s ease',
  });

  return (
    <div style={{ textAlign: 'center', marginBottom: '30px' }}>
      <form onSubmit={handleSearch} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
        <input
          type="text"
          placeholder="Search movies, TV shows, or actors..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setInputFocused(true)}
          onBlur={() => setInputFocused(false)}
          style={{
            fontSize: '1rem',
            padding: '12px 18px',
            width: '100%',
            maxWidth: '500px',
            backgroundColor: '#111',
            color: '#fff',
            border: `2px solid ${inputFocused ? '#8b0000' : '#1e1e1e'}`,
            borderRadius: '8px',
            outline: 'none',
            fontFamily: "'Poppins', sans-serif",
            transition: 'border-color 0.2s ease',
          }}
        />
        <button type="submit" style={actionBtnStyle('primary')}>Search</button>
        <button type="button" onClick={onClear} style={actionBtnStyle('secondary')}>Clear</button>
      </form>
      <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
        <button type="button" onClick={() => onCategoryChange('movie')} style={pillStyle(selectedCategory === 'movie')}>Movies</button>
        <button type="button" onClick={() => onCategoryChange('tv')} style={pillStyle(selectedCategory === 'tv')}>TV Shows</button>
        <button type="button" onClick={() => onCategoryChange('actor')} style={pillStyle(selectedCategory === 'actor')}>Actors</button>
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

  // Fetches certification + cast for a movie in ONE request using append_to_response
  // This replaces the previous N+1 pattern of 2 separate calls per movie
  const fetchMovieDetails = async (movieId) => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/${movieId}?append_to_response=release_dates,credits&api_key=${API_KEY}`,
        { headers: { Authorization: `Bearer ${ACCESS_TOKEN}` } }
      );
      if (!response.ok) return { certification: 'N/A', actors: [] };
      const detail = await response.json();
      const usRelease = detail.release_dates?.results?.find(r => r.iso_3166_1 === 'US');
      const certification = usRelease?.release_dates[0]?.certification || 'N/A';
      const actors = (detail.credits?.cast || []).slice(0, 5).map(a => ({ name: a.name, character: a.character }));
      return { certification, actors };
    } catch (error) {
      console.error('Error fetching movie details:', error);
      return { certification: 'N/A', actors: [] };
    }
  };

  const fetchMovies = useCallback(async () => {
    try {
      const response = await fetch(`https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}`, {
        headers: { Authorization: `Bearer ${ACCESS_TOKEN}` },
      });
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      if (data.errors) {
        setErrorMessage(data.errors.join(', '));
      } else {
        // All detail fetches run in parallel — one request per movie instead of two
        const moviesWithDetails = await Promise.all(
          data.results.map(async (movie) => {
            const { certification, actors } = await fetchMovieDetails(movie.id);
            return { ...movie, certification, actors };
          })
        );
        setMovies(moviesWithDetails);
        setSearchResults(moviesWithDetails);
      }
    } catch (error) {
      console.error('Error fetching movies:', error);
      setErrorMessage('An error occurred while fetching movie data.');
    }
  }, []);

  const handleSearch = useCallback(async (query) => {
    try {
      const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${query}`, {
        headers: { Authorization: `Bearer ${ACCESS_TOKEN}` },
      });
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      if (data.errors) {
        setErrorMessage(data.errors.join(', '));
      } else {
        const moviesWithDetails = await Promise.all(
          data.results.map(async (movie) => {
            const { certification, actors } = await fetchMovieDetails(movie.id);
            return { ...movie, certification, actors };
          })
        );
        setSearchResults(moviesWithDetails);
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
      {searchQuery && <h2 style={sectionHeadingStyle}>Search Results for Movies</h2>}
      {searchQuery && searchResults.length === 0 && <p style={{ fontFamily: "'Poppins', sans-serif", color: '#aaa' }}>No results found.</p>}
      {!searchQuery && <h2 style={sectionHeadingStyle}>Top Rated Movies</h2>}
      {errorMessage ? (
        <div style={errorBoxStyle}>
          <p style={{ margin: 0 }}>{errorMessage}</p>
        </div>
      ) : (
        <div style={gridStyle}>
          {currentMovies.map((movie) => (
            <div
              key={movie.id}
              style={cardStyle}
              onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 6px 24px rgba(139,0,0,0.35)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <img
                src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                alt={movie.title}
                style={{ width: '100%', display: 'block', aspectRatio: '2/3', objectFit: 'cover' }}
              />
              <div style={{ padding: '12px', fontFamily: "'Poppins', sans-serif" }}>
                <h3 style={{ margin: '0 0 6px 0', fontSize: '0.95rem', fontFamily: "'Playfair Display', serif", color: '#fff', lineHeight: 1.3 }}>
                  {movie.title}
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
                  <span style={{
                    display: 'inline-block',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    backgroundColor: ratingBadgeColor(movie.vote_average),
                    color: '#fff',
                  }}>
                    {movie.vote_average?.toFixed(1)}
                  </span>
                  <span style={{ fontSize: '0.78rem', color: '#888' }}>
                    {movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}
                  </span>
                  <a
                    href={`https://www.themoviedb.org/movie/${movie.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#40e0d0', textDecoration: 'none', fontSize: '0.78rem', marginLeft: 'auto' }}
                  >
                    TMDB
                  </a>
                </div>
                <p style={{ fontSize: '0.78rem', color: '#999', margin: '0 0 8px 0', lineHeight: 1.45, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {movie.overview}
                </p>
                <div style={{ borderTop: '1px solid #1e1e1e', paddingTop: '8px', fontSize: '0.75rem', color: '#888' }}>
                  <span>Cert: {movie.certification}</span>
                </div>
                <div style={{ borderTop: '1px solid #1e1e1e', paddingTop: '8px', marginTop: '8px', fontSize: '0.72rem', color: '#777', lineHeight: 1.6 }}>
                  {movie.actors?.map(actor => (
                    <React.Fragment key={actor.name}>
                      <span style={{ color: '#ccc' }}>{actor.name}</span> <span style={{ color: '#555' }}>as</span> {actor.character}<br />
                    </React.Fragment>
                  )) || 'N/A'}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {!searchQuery && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '24px', flexWrap: 'wrap' }}>
          {Array.from({ length: Math.ceil(movies.length / moviesPerPage) }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => paginate(index + 1)}
              style={paginationBtn(currentPage === index + 1)}
            >
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

  // Fetches content rating + cast for a TV show in ONE request using append_to_response
  const fetchShowDetails = async (showId) => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/tv/${showId}?append_to_response=content_ratings,credits&api_key=${API_KEY}`,
        { headers: { Authorization: `Bearer ${ACCESS_TOKEN}` } }
      );
      if (!response.ok) return { certification: 'N/A', actors: [] };
      const detail = await response.json();
      const usRating = detail.content_ratings?.results?.find(r => r.iso_3166_1 === 'US');
      const certification = usRating?.rating || 'N/A';
      const actors = (detail.credits?.cast || []).slice(0, 5).map(a => ({ name: a.name, character: a.character }));
      return { certification, actors };
    } catch (error) {
      console.error('Error fetching show details:', error);
      return { certification: 'N/A', actors: [] };
    }
  };

  const fetchTvShows = useCallback(async () => {
    try {
      const response = await fetch(`https://api.themoviedb.org/3/tv/top_rated?api_key=${API_KEY}`, {
        headers: { Authorization: `Bearer ${ACCESS_TOKEN}` },
      });
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      if (data.errors) {
        setErrorMessage(data.errors.join(', '));
      } else {
        // All detail fetches run in parallel — one request per show instead of two
        const showsWithDetails = await Promise.all(
          data.results.map(async (show) => {
            const { certification, actors } = await fetchShowDetails(show.id);
            return { ...show, certification, actors };
          })
        );
        setTvShows(showsWithDetails);
        setSearchResults(showsWithDetails);
      }
    } catch (error) {
      console.error('Error fetching TV shows:', error);
      setErrorMessage('An error occurred while fetching TV show data.');
    }
  }, []);

  const handleSearch = useCallback(async (query) => {
    try {
      const response = await fetch(`https://api.themoviedb.org/3/search/tv?api_key=${API_KEY}&query=${query}`, {
        headers: { Authorization: `Bearer ${ACCESS_TOKEN}` },
      });
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      if (data.errors) {
        setErrorMessage(data.errors.join(', '));
      } else {
        const showsWithDetails = await Promise.all(
          data.results.map(async (show) => {
            const { certification, actors } = await fetchShowDetails(show.id);
            return { ...show, certification, actors };
          })
        );
        setSearchResults(showsWithDetails);
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

  const indexOfLastTvShow = currentPage * tvShowsPerPage;
  const indexOfFirstTvShow = indexOfLastTvShow - tvShowsPerPage;
  const currentTvShows = searchResults.slice(indexOfFirstTvShow, indexOfLastTvShow);

  const paginate = pageNumber => setCurrentPage(pageNumber);

  return (
    <div style={{ marginTop: '20px' }}>
      {searchQuery && <h2 style={sectionHeadingStyle}>Search Results for TV Shows</h2>}
      {searchQuery && searchResults.length === 0 && <p style={{ fontFamily: "'Poppins', sans-serif", color: '#aaa' }}>No results found.</p>}
      {!searchQuery && <h2 style={sectionHeadingStyle}>Top Rated TV Shows</h2>}
      {errorMessage ? (
        <div style={errorBoxStyle}>
          <p style={{ margin: 0 }}>{errorMessage}</p>
        </div>
      ) : (
        <div style={gridStyle}>
          {currentTvShows.map((show) => (
            <div
              key={show.id}
              style={cardStyle}
              onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 6px 24px rgba(139,0,0,0.35)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <img
                src={`https://image.tmdb.org/t/p/w300${show.poster_path}`}
                alt={show.name}
                style={{ width: '100%', display: 'block', aspectRatio: '2/3', objectFit: 'cover' }}
              />
              <div style={{ padding: '12px', fontFamily: "'Poppins', sans-serif" }}>
                <h3 style={{ margin: '0 0 6px 0', fontSize: '0.95rem', fontFamily: "'Playfair Display', serif", color: '#fff', lineHeight: 1.3 }}>
                  {show.name}
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
                  <span style={{
                    display: 'inline-block',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    backgroundColor: ratingBadgeColor(show.vote_average),
                    color: '#fff',
                  }}>
                    {show.vote_average?.toFixed(1)}
                  </span>
                  <span style={{ fontSize: '0.78rem', color: '#888' }}>
                    {show.first_air_date ? new Date(show.first_air_date).getFullYear() : 'N/A'}
                  </span>
                  <a
                    href={`https://www.themoviedb.org/tv/${show.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#40e0d0', textDecoration: 'none', fontSize: '0.78rem', marginLeft: 'auto' }}
                  >
                    TMDB
                  </a>
                </div>
                <p style={{ fontSize: '0.78rem', color: '#999', margin: '0 0 8px 0', lineHeight: 1.45, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {show.overview}
                </p>
                <div style={{ borderTop: '1px solid #1e1e1e', paddingTop: '8px', fontSize: '0.75rem', color: '#888' }}>
                  <span>Cert: {show.certification}</span>
                </div>
                <div style={{ borderTop: '1px solid #1e1e1e', paddingTop: '8px', marginTop: '8px', fontSize: '0.72rem', color: '#777', lineHeight: 1.6 }}>
                  {show.actors?.map(actor => (
                    <React.Fragment key={actor.name}>
                      <span style={{ color: '#ccc' }}>{actor.name}</span> <span style={{ color: '#555' }}>as</span> {actor.character}<br />
                    </React.Fragment>
                  )) || 'N/A'}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {!searchQuery && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '24px', flexWrap: 'wrap' }}>
          {Array.from({ length: Math.ceil(tvShows.length / tvShowsPerPage) }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => paginate(index + 1)}
              style={paginationBtn(currentPage === index + 1)}
            >
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
        headers: { Authorization: `Bearer ${ACCESS_TOKEN}` },
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
        headers: { Authorization: `Bearer ${ACCESS_TOKEN}` },
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
        headers: { Authorization: `Bearer ${ACCESS_TOKEN}` },
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
      {searchQuery && <h2 style={sectionHeadingStyle}>Search Results for Actors</h2>}
      {searchQuery && searchResults.length === 0 && <p style={{ fontFamily: "'Poppins', sans-serif", color: '#aaa' }}>No results found.</p>}
      {!searchQuery && <h2 style={sectionHeadingStyle}>Popular Actors</h2>}
      {errorMessage ? (
        <div style={errorBoxStyle}>
          <p style={{ margin: 0 }}>{errorMessage}</p>
        </div>
      ) : (
        <div style={gridStyle}>
          {currentActors.map((actor) => (
            <div
              key={actor.id}
              style={cardStyle}
              onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 6px 24px rgba(139,0,0,0.35)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <div style={{ display: 'flex', justifyContent: 'center', padding: '20px 0 10px 0' }}>
                <img
                  src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`}
                  alt={actor.name}
                  style={{
                    width: '120px',
                    height: '120px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    cursor: 'pointer',
                    border: '3px solid #1e1e1e',
                    transition: 'border-color 0.2s ease',
                  }}
                  onClick={() => handleActorClick(actor.id)}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#8b0000'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#1e1e1e'; }}
                />
              </div>
              <div style={{ textAlign: 'center', padding: '8px 12px 16px 12px', fontFamily: "'Poppins', sans-serif" }}>
                <h3 style={{ margin: '0', fontSize: '0.95rem', fontFamily: "'Playfair Display', serif", color: '#fff' }}>
                  {actor.name}
                </h3>
              </div>
            </div>
          ))}
        </div>
      )}
      {!searchQuery && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '24px', flexWrap: 'wrap' }}>
          {Array.from({ length: Math.ceil(actors.length / actorsPerPage) }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => paginate(index + 1)}
              style={paginationBtn(currentPage === index + 1)}
            >
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
    setActorTopMovies([]); // Clear actor top movies
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setSearchQuery('');
    if (category !== 'actor') {
      setActorTopMovies([]); // Clear actor top movies when changing to non-actor category
    }
  };

  const handleActorClick = (topMovies) => {
    setActorTopMovies(topMovies.slice(0, 12)); // Set top 12 movies or TV shows
  };

  return (
    <div style={{ backgroundColor: '#000', color: '#fff', minHeight: '100vh', padding: '30px 20px', fontFamily: "'Poppins', sans-serif" }}>
      <SearchBar onSearch={handleSearch} onClear={handleClear} onCategoryChange={handleCategoryChange} selectedCategory={selectedCategory} />
      {selectedCategory === 'movie' && <TheMovieDBTopMovies searchQuery={searchQuery} />}
      {selectedCategory === 'tv' && <TheMovieDBTopTVShows searchQuery={searchQuery} />}
      {selectedCategory === 'actor' && <TheMovieDBTopActors searchQuery={searchQuery} onActorClick={handleActorClick} />}
      {actorTopMovies.length > 0 && (
        <div style={{ marginTop: '32px' }}>
          <h2 style={sectionHeadingStyle}>Top Movies / TV Shows for Selected Actor</h2>
          <button
            onClick={() => setActorTopMovies([])}
            style={{
              marginBottom: '16px',
              padding: '10px 24px',
              backgroundColor: '#8b0000',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontFamily: "'Poppins', sans-serif",
              fontSize: '0.9rem',
              fontWeight: 600,
              transition: 'background-color 0.2s ease',
            }}
          >
            Clear Actor Results
          </button>
          <div style={gridStyle}>
            {actorTopMovies.map((item) => (
              <div
                key={item.id}
                style={cardStyle}
                onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 6px 24px rgba(139,0,0,0.35)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <img
                  src={`https://image.tmdb.org/t/p/w300${item.poster_path}`}
                  alt={item.title || item.name}
                  style={{ width: '100%', display: 'block', aspectRatio: '2/3', objectFit: 'cover' }}
                />
                <div style={{ padding: '12px', fontFamily: "'Poppins', sans-serif" }}>
                  <h3 style={{ margin: '0 0 6px 0', fontSize: '0.95rem', fontFamily: "'Playfair Display', serif", color: '#fff', lineHeight: 1.3 }}>
                    {item.title || item.name}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
                    <span style={{
                      display: 'inline-block',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      backgroundColor: ratingBadgeColor(item.vote_average),
                      color: '#fff',
                    }}>
                      {item.vote_average?.toFixed(1)}
                    </span>
                    <span style={{ fontSize: '0.78rem', color: '#888' }}>
                      {item.release_date ? new Date(item.release_date).getFullYear() : 'N/A'}
                    </span>
                    <a
                      href={`https://www.themoviedb.org/${item.media_type}/${item.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: '#40e0d0', textDecoration: 'none', fontSize: '0.78rem', marginLeft: 'auto' }}
                    >
                      TMDB
                    </a>
                  </div>
                  <p style={{ fontSize: '0.78rem', color: '#999', margin: '0', lineHeight: 1.45, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {item.overview || 'N/A'}
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

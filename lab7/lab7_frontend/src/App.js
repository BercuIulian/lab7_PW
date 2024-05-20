import React, { useState, useEffect } from 'react';
import MovieList from './components/MovieList';
import AddMovieForm from './components/AddMovieForm';
import Filter from './components/Filter';
import ThemeToggle from './components/ThemeToggle';
import { ThemeProvider } from './ThemeContext';
import { getMovies, addMovie, updateMovie, deleteMovie, login, isAuthenticated, getPermissions } from './api';

const App = () => {
  const [movies, setMovies] = useState([]);
  const [filter, setFilter] = useState('');
  const [permissions, setPermissions] = useState([]);
  const [loggedIn, setLoggedIn] = useState(isAuthenticated());

  useEffect(() => {
    const fetchMovies = async () => {
      if (isAuthenticated()) {
        const movies = await getMovies();
        setMovies(movies);
      }
    };

    fetchMovies();
    setPermissions(getPermissions());
  }, [loggedIn]);

  const handleAddMovie = async (title) => {
    const newMovie = await addMovie({ title, likes: 0 });
    setMovies([...movies, newMovie]);
  };

  const handleLikeMovie = async (id) => {
    const movie = movies.find(movie => movie.id === id);
    const updatedMovie = await updateMovie(id, { ...movie, likes: movie.likes + 1 });
    setMovies(movies.map(movie => movie.id === id ? updatedMovie : movie));
  };

  const handleDeleteMovie = async (id) => {
    await deleteMovie(id);
    setMovies(movies.filter(movie => movie.id !== id));
  };

  const filteredMovies = movies.filter(movie =>
    movie.title.toLowerCase().includes(filter.toLowerCase())
  );

  const handleLogin = async (username, role) => {
    await login(username, role);
    setLoggedIn(true);
    setPermissions(getPermissions());
    const movies = await getMovies();
    setMovies(movies);
  };

  return (
    <ThemeProvider>
      <div className="App">
        <h1>Movie Manager</h1>
        <ThemeToggle />
        {!loggedIn && (
          <div>
            <button onClick={() => handleLogin('user', 'VISITOR')}>Login as Visitor</button>
            <button onClick={() => handleLogin('admin', 'ADMIN')}>Login as Admin</button>
          </div>
        )}
        {loggedIn && (
          <>
            {permissions.includes('WRITE') && <AddMovieForm onAdd={handleAddMovie} />}
            <Filter filter={filter} setFilter={setFilter} />
            <MovieList movies={filteredMovies} onLike={handleLikeMovie} onDelete={handleDeleteMovie} />
          </>
        )}
      </div>
    </ThemeProvider>
  );
};

export default App;

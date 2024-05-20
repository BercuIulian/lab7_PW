import React from 'react';
import MovieItem from './MovieItem';

const MovieList = ({ movies, onLike, onDelete, onEdit }) => {
  return (
    <div>
      {movies.map(movie => (
        <MovieItem
          key={movie.id}
          movie={movie}
          onLike={onLike}
          onDelete={onDelete}
          onEdit={onEdit} // Pass onEdit function here
        />
      ))}
    </div>
  );
};

export default MovieList;
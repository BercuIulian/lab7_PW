import React, { useState } from 'react';

const MovieItem = ({ movie, onLike, onDelete, onEdit }) => {
  const [editMode, setEditMode] = useState(false);
  const [editedTitle, setEditedTitle] = useState(movie.title);

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleSaveEdit = () => {
    onEdit(movie.id, editedTitle); // Call onEdit function here
    setEditMode(false);
  };

  const handleCancelEdit = () => {
    setEditedTitle(movie.title);
    setEditMode(false);
  };

  const handleChange = (e) => {
    setEditedTitle(e.target.value);
  };

  return (
    <div className="movie-item">
      {!editMode ? (
        <>
          <h3>{movie.title}</h3>
          <div>
            <button onClick={() => onLike(movie.id)}>Like ({movie.likes})</button>
            <button onClick={handleEdit}>Edit</button>
            <button onClick={() => onDelete(movie.id)}>Delete</button>
          </div>
        </>
      ) : (
        <div>
          <input type="text" value={editedTitle} onChange={handleChange} />
          <button onClick={handleSaveEdit}>Save</button>
          <button onClick={handleCancelEdit}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default MovieItem;

import React, { useState } from 'react';
import axios from 'axios';

const AddSeries = () => {
  const [title, setTitle] = useState('');
  const [rating, setRating] = useState(0);
  const [status, setStatus] = useState('watched');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post('http://localhost:8000/series', { title, rating, status });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" placeholder="Series Title" onChange={e => setTitle(e.target.value)} />
      <input type="number" placeholder="Rating" onChange={e => setRating(parseFloat(e.target.value))} />
      <select onChange={e => setStatus(e.target.value)}>
        <option value="watched">Watched</option>
        <option value="upcoming">Upcoming</option>
        <option value="half-watched">Half-Watched</option>
      </select>
      <button type="submit">Add Series</button>
    </form>
  );
};

export default AddSeries;

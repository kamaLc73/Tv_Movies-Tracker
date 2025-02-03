import React, { useEffect, useState } from 'react';
import axios from 'axios';

const SeriesList = () => {
  const [series, setSeries] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8000/series')
      .then(response => {
        setSeries(response.data);
      });
  }, []);

  return (
    <div>
      <h1>Watched Series</h1>
      <ul>
        {series.map((serie) => (
          <li key={serie.id}>{serie.title} - {serie.rating}/10</li>
        ))}
      </ul>
    </div>
  );
};

export default SeriesList;

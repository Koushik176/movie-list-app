import React, { useState } from "react";

import MoviesList from "./components/MoviesList";
import "./App.css";

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsloading] = useState(false);
  const [error, setError] = useState(null);
  const [dataFetch, setDataFetch] = useState(false);

  async function fetchMoviesHandler() {
    setIsloading(true);
    setError(null);
    try {
      setDataFetch(true);
      let response = await fetch("https://swapi.py4e.com/api/film/");
      if (!response.ok) {
        const myInterval = setInterval(async () => {
          response = await fetch("https://swapi.py4e.com/api/films/");
          if (response.ok) {
            setDataFetch(false);
            clearInterval(myInterval);
            return;
          }
        }, 5000);
        throw new Error("Something went Wrong ...Retrying!!!");
      }

      const data = await response.json();

      const transformedMovies = data.results.map((movieData) => {
        return {
          id: movieData.episode_id,
          title: movieData.title,
          openingText: movieData.opening_crawl,
          releaseDate: movieData.release_date,
        };
      });
      setMovies(transformedMovies);
    } catch (error) {
      setError(error.message);
    }
    setIsloading(false);
  }

  let content = <p>Found no movies.</p>;

  if (movies.length > 0) {
    content = <MoviesList movies={movies} />;
  }

  if (error && dataFetch) {
    content = (
      <section>
        <p>{error}</p>
        <button>Cancel</button>
      </section>
    );
  }

  if (isLoading) {
    content = <p>Loading..</p>;
  }
  console.log(movies);
  return (
    <React.Fragment>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
      </section>
      <section>{content}</section>
    </React.Fragment>
  );
}

export default App;

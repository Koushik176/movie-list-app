import React, { useCallback, useEffect, useState } from "react";

import MoviesList from "./components/MoviesList";
import "./App.css";
import AddMovie from "./components/AddMovie";

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsloading] = useState(true);
  const [error, setError] = useState(null);
  const [dataFetch, setDataFetch] = useState(false);

  const fetchMoviesHandler = useCallback(async () => {
    setError(null);
    var myInterval = setInterval(tryToGetData, 5000);

    async function tryToGetData() {
      try {
        setDataFetch(true);
        let response = await fetch("https://swapi.py4e.com/api/films/");
        if (!response.ok) {
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
        clearInterval(myInterval);
        setIsloading(false);
      } catch (error) {
        setError(error.message);
      }
    };
  }, []);

  useEffect(() => {
    fetchMoviesHandler();
  }, [fetchMoviesHandler]);

  function addMovieHandler(movie) {
    console.log(movie);
  }

  const dataFetchHandler = (event) => {
    event.preventDefault();
    setDataFetch(false);
  };

  let content = <p>Found no movies.</p>;

  if (movies.length > 0) {
    content = <MoviesList movies={movies} />;
  }

  if (error && dataFetch) {
    content = (
      <section>
        <p>{error}</p>
        <button onClick={dataFetchHandler}>Cancel</button>
      </section>
    );
  }

  if (isLoading) {
    content = <p>Loading..</p>;
  }
  return (
    <React.Fragment>
      <section>
        <AddMovie onAddMovie={addMovieHandler} />
      </section>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
      </section>
      <section>{content}</section>
    </React.Fragment>
  );
}

export default App;

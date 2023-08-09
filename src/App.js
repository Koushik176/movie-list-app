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
        let response = await fetch("https://react-http-c7443-default-rtdb.firebaseio.com/movies.json");
        if (!response.ok) {
          throw new Error("Something went Wrong ...Retrying!!!");
        }
        const data = await response.json();

        const laodedMovies = [];

        for( const key in data) {
          laodedMovies.push({
            id: key,
            title: data[key].title,
            openingText : data[key].openingText,
            releaseDate: data[key].releaseDate,
          });
        }
  
        setMovies(laodedMovies);
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

  async function addMovieHandler(movie) {
    const response = await fetch("https://react-http-c7443-default-rtdb.firebaseio.com/movies.json",{
      method: 'POST',
      body: JSON.stringify(movie),
      headers: {
        'Content_Type': 'application/json'
      }
    });
    const data = await response.json();
    console.log(data);
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

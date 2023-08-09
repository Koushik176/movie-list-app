import React from "react";

import classes from "./Movie.module.css";

const Movie = (props) => {
  const deleteHandler = async (event) => {
    event.preventDefault();
      const response = await fetch(
        `https://react-http-c7443-default-rtdb.firebaseio.com/movies.json/${props.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin" : "http://localhost:3000",
            "Allow-Control-Allow-Methods" : "DELETE"
          }
        }
      );
      console.log(response);
  };
  return (
    <li className={classes.movie}>
      <h2>{props.title}</h2>
      <h3>{props.releaseDate}</h3>
      <p>{props.openingText}</p>
      <button onClick={deleteHandler}>Delete</button>
    </li>
  );
};

export default Movie;

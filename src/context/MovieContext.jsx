import React, { createContext, useState, useEffect, useCallback } from "react";
import axios from "axios";

export const MovieContext = createContext();

export const MovieProvider = ({ children }) => {
  const [movie, setMovie] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMovie = useCallback(async (movieId, userId, apiUrl) => {
    try {
      setIsLoading(true);
      const [
        movieResponse,
        likeStatusResponse,
        likeCountResponse,
        paymentStatusResponse,
      ] = await Promise.all([
        axios.get(`${apiUrl}/api/movies/${movieId}`),
        userId
          ? axios.get(`${apiUrl}/api/movies/${movieId}/like`, {
              params: { userId },
            })
          : Promise.resolve(null),
        axios.get(`${apiUrl}/api/movies/${movieId}/like-count`),
        userId
          ? axios.post(`${apiUrl}/api/payments/status`, { userId, movieId })
          : Promise.resolve(null),
      ]);

      const movieData = movieResponse.data.data;
      movieData.release_year = new Date(movieData.release_date).getFullYear();

      const personDetailsPromises = movieData.castAndCrews.map(
        async (person) => {
          const response = await axios.get(
            `${apiUrl}/api/persons/${person.person}`
          );
          return { ...response.data, role: person.role, type: person.type };
        }
      );

      const personDetailsArray = await Promise.all(personDetailsPromises);

      setMovie({
        data: movieData,
        likeStatus: likeStatusResponse ? likeStatusResponse.data : null,
        likeCount: likeCountResponse.data,
        paymentStatus: paymentStatusResponse
          ? paymentStatusResponse.data
          : null,
        personDetails: personDetailsArray,
      });
    } catch (error) {
      console.error("Error fetching movie data:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <MovieContext.Provider value={{ movie, isLoading, fetchMovie }}>
      {children}
    </MovieContext.Provider>
  );
};

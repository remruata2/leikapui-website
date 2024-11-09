import { useState, useEffect } from "react";
import axios from "axios";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

const AllMovies = () => {
  const [movies, setMovies] = useState([]);
  const apiUrl = import.meta.env.VITE_API_URL;
  useEffect(() => {
    axios
      .get(`${apiUrl}/api/movies`)
      .then((response) => {
        setMovies(response.data.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the movies!", error);
      });
  }, []);

  return (
    <Container>
      <Row>
        {movies.map((movie) => (
          <Col
            key={movie._id}
            xs={12}
            sm={6}
            md={4}
            lg={3}
            className="mb-4 mt-5"
          >
            <div className="movie-card">
              <Link to={`/movies-detail/${movie._id}`}>
                <img
                  src={movie.vertical_poster}
                  alt={movie.title}
                  className="img-fluid"
                />
                <h5 className="mt-2">{movie.title}</h5>
              </Link>
            </div>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default AllMovies;

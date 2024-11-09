import { useState, useEffect } from "react";
import axios from "axios";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

const AllTvShows = () => {
  const [tvShows, setTvShows] = useState([]);
  const apiUrl = import.meta.env.VITE_API_URL;
  useEffect(() => {
    axios
      .get(`${apiUrl}/api/tvShows`)
      .then((response) => {
        setTvShows(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the Tv Shows!", error);
      });
  }, []);

  return (
    <Container>
      <Row>
        {tvShows.map((tvShow) => (
          <Col
            key={tvShow._id}
            xs={12}
            sm={6}
            md={4}
            lg={3}
            className="mb-4 mt-5"
          >
            <div className="tvShow-card">
              <Link to={`/shows-details/${tvShow._id}`}>
                <img
                  src={tvShow.vertical_poster}
                  alt={tvShow.show_name}
                  className="img-fluid"
                />
                <h5 className="mt-2">{tvShow.title}</h5>
              </Link>
            </div>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default AllTvShows;

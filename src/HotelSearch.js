import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button, Row, Col, Card, Spinner, Alert } from 'react-bootstrap';

function priceLevelToString(priceLevel) {
  switch (priceLevel) {
    case 0: return "Gratis";
    case 1: return "Económico";
    case 2: return "Moderado";
    case 3: return "Caro";
    case 4: return "Muy caro";
    default: return "N/A";
  }
}

function HotelSearch() {
  const [city, setCity] = useState('');
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setHotels([]);
    try {
      const res = await axios.get(`http://localhost:8080/hoteles?destino=${encodeURIComponent(city)}`);
      setHotels(res.data);
    } catch (err) {
      setError('No se pudieron obtener los hoteles. Verifica el backend.');
    }
    setLoading(false);
  };

  return (
    <div>
      <h2>Buscar Hoteles</h2>
      <Form onSubmit={handleSearch}>
        <Row>
          <Col md={8}>
            <Form.Control
              type="text"
              placeholder="Ej: guayaquil,ecuador"
              value={city}
              onChange={e => setCity(e.target.value)}
              required
            />
          </Col>
          <Col md={4}>
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? <Spinner animation="border" size="sm" /> : 'Buscar'}
            </Button>
          </Col>
        </Row>
      </Form>
      {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
      <Row className="mt-4">
        {hotels.map((hotel, idx) => (
          <Col md={4} key={idx} className="mb-3">
            <Card>
              <Card.Body>
                <Card.Title>{hotel.name}</Card.Title>
                <Card.Text>
                  <b>Precio:</b> {priceLevelToString(hotel.priceLevel)}<br />
                  <b>Estrellas:</b> {hotel.rating >= 0 ? hotel.rating : 'N/A'}<br />
                  <b>Calificaciones:</b> {hotel.userRatingsTotal >= 0 ? hotel.userRatingsTotal : 'N/A'}
                </Card.Text>
                {hotel.reviews && hotel.reviews.length > 0 && (
                  <div>
                    <b>Reseñas:</b>
                    <ul>
                      {hotel.reviews.map((r, i) => <li key={i}>{r}</li>)}
                    </ul>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default HotelSearch;

import React, { useState } from 'react';
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
      const response = await fetch(`http://localhost:8082/api/hoteles/buscar?destino=${encodeURIComponent(city)}`);
      const data = await response.json();

      if (data.results) {
        setHotels(data.results);
      } else {
        setError('No se encontraron resultados.');
      }
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
              placeholder="Ej: Guayaquil, Ecuador"
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
                  <b>Precio:</b> {priceLevelToString(hotel.price_level)}<br />
                  <b>Estrellas:</b> {hotel.rating ?? 'N/A'}<br />
                  <b>Calificaciones:</b> {hotel.user_ratings_total ?? 'N/A'}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default HotelSearch;

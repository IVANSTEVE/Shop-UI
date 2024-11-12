import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
//import './Footer.css'; 

function Footer() {
  return (
    <footer style={footerStyle}>
      <Container>
        <Row>
          <Col className="text-center">
            <p>&copy; 2024 My Web Site</p>
            <p>
              <a href="/privacy-policy">Privacy policy</a> |{' '}
              <a href="/terms-of-service">Terms of service</a>
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

// Style en ligne pour le footer
const footerStyle = {
  backgroundColor: '#343a40', // couleur de fond sombre
  color: 'white',
  padding: '20px 0',
  position: 'relative',
  bottom: 0,
  width: '100%',
};

export default Footer;

import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './Footer.css';

function Footer() {

    return (
        <footer className="footer-custom" style={{ backgroundColor: '#212529' }}>
            <Container fluid className="text-center py-3">
                <Row>
                    <Col md={6}>
                        <h5>T-Shirt Shop</h5>
                        <p>Votre boutique en ligne pour les meilleurs t-shirts !</p>
                    </Col>
                    <Col md={3}>
                        <h5>Liens utiles</h5>
                        <ul className="list-unstyled">
                            <li><Link to="/FaqText" className="footer-link">Faq</Link></li>
                            <li><Link to="/ContactText" className="footer-link">Contact</Link></li>
                            <li><Link to="/AboutText" className="footer-link">À propos</Link></li>
                            <li><Link to="/RGPDText" className="footer-link">Politique de confidentialité</Link></li>
                        </ul>
                    </Col>
                    <Col md={3}>
                        <h5>Suivez-nous</h5>
                        <div className="d-flex justify-content-center">
                            <a href="https://facebook.com" className="footer-icon mx-2">
                                <i className="fab fa-facebook-f"></i>
                            </a>
                            <a href="https://twitter.com" className="footer-icon mx-2">
                                <i className="fab fa-twitter"></i>
                            </a>
                            <a href="https://instagram.com" className="footer-icon mx-2">
                                <i className="fab fa-instagram"></i>
                            </a>
                        </div>
                    </Col>
                </Row>
                <hr />
                <p className="small">© 2024 T-Shirt Shop. Tous droits réservés.</p>
            </Container>
        </footer>

    );

}

export default Footer;

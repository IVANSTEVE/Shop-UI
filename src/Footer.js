import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './Footer.css'; // Utilisez un fichier CSS dédié pour des styles plus or

function Footer() {
    return (
        <footer className="footer-custom bg-secondary text-light">
            <Container fluid className="text-center py-1">
                <Row className="align-items-center">
                    <Col md={6}>
                        <h5>T-Shirt Shop</h5>
                        <p>Votre boutique en ligne pour les meilleurs t-shirts !</p>
                        <p>
                            <a href="/privacy-policy" className="footer-link">Politique de confidentialité</a> |{' '}
                            <a href="/terms-of-service" className="footer-link">Conditions d'utilisation</a>
                        </p>
                    </Col>
                    <Col md={3}>
                        <h5>Liens utiles</h5>
                        <ul className="list-unstyled">
                            <li><a href="#home" className="footer-link">Accueil</a></li>
                            <li><a href="#about" className="footer-link">À propos</a></li>
                            <li><a href="#contact" className="footer-link">Contact</a></li>
                            <li><a href="#faq" className="footer-link">FAQ</a></li>
                        </ul>
                    </Col>
                    <Col md={3}>
                        <h5>Suivez-nous</h5>
                        <div>
                            <a href="https://facebook.com" className="footer-icon">
                                <i className="fab fa-facebook-f"></i>
                            </a>
                            <a href="https://twitter.com" className="footer-icon">
                                <i className="fab fa-twitter"></i>
                            </a>
                            <a href="https://instagram.com" className="footer-icon">
                                <i className="fab fa-instagram"></i>
                            </a>
                        </div>
                    </Col>
                    <hr style={{ borderColor: '#555' }} />
                <div className="text-center">
                    <p style={{ marginBottom: '0' }}>© 2024 T-Shirt Shop. Tous droits réservés.</p>
                </div>
                </Row>
            </Container>
        </footer>
    );
}

export default Footer;

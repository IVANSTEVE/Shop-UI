import React, { useState } from "react";
import { Container, Row, Col, Button } from 'react-bootstrap';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './Footer.css';
import AboutText from "./AboutText";
import ContactText from "./ContactText";
import FaqText from "./FaqText";
import RGPDText from "./RGPDText";
function Footer() {
  const [activeComponent, setActiveComponent] = useState(null);
  const renderActiveComponent = () => {
    switch (activeComponent) {
      case "about":
        return <AboutText />;
      case "contact":
        return <ContactText />;
      case "faq":
        return <FaqText />;
      case "rgpd":
        return <RGPDText />;
      default:
        return <p>Sélectionnez un lien pour afficher son contenu.</p>;
    }
  };
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
          <li><Button variant="link"onClick={() => setActiveComponent("about")}>A propos</Button></li>
          <li><Button variant="link" onClick={() => setActiveComponent("contact")}>Contact</Button></li>
          <li><Button variant="link" onClick={() => setActiveComponent("faq")}>Faq</Button></li>
          <li><Button variant="link" onClick={() => setActiveComponent("rgpd")}>Politique de confidentialité</Button></li>
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

      <div>
        {renderActiveComponent()}
      </div>
    </footer>
  );
}
export default Footer;
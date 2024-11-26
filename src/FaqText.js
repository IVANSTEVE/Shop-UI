import React from "react";
import { Accordion } from "react-bootstrap";
const FAQText = () => {
    return (
        <div>
        <h3> Questions fréquemment posées</h3>
        <Accordion>
            <Accordion.Item eventKey="0">
                <Accordion.Header>Quels types de T-shirts proposez-vous ?</Accordion.Header>
                <Accordion.Body>
                    Nous proposons des modèles casual, premium et personnalisables adaptés à tous les styles.
                </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="1">
                <Accordion.Header>Puis-je échanger un T-shirt ?</Accordion.Header>
                <Accordion.Body>
                    Oui, vous pouvez échanger un T-shirt dans les 14 jours suivant la réception, à condition qu'il soit non porté et dans son emballage d'origine.
                </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="2">
                <Accordion.Header>Livrez-vous à l’étranger ?</Accordion.Header>
                <Accordion.Body>
                Oui, nous livrons dans plusieurs pays. Les délais et frais de livraison peuvent varier en fonction de votre localisation.
                </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="3">
                <Accordion.Header>Quels sont vos moyens de paiement acceptés ?</Accordion.Header>
                <Accordion.Body>  
                Nous acceptons les cartes bancaires (Visa, Mastercard), PayPal, et d’autres options locales selon votre pays.
                </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="4">
                <Accordion.Header> Quelles tailles proposez-vous ?</Accordion.Header>
                <Accordion.Body>
                Nous proposons des tailles allant du XS au 3XL. Consultez notre guide des tailles pour trouver celle qui vous convient le mieux.
                </Accordion.Body>
            </Accordion.Item>
        </Accordion>
      </div>
    );
};

export default FAQText;

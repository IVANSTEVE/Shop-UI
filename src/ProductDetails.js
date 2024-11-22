import useSWR from "swr";
import {Button, Card, Col, Row} from "react-bootstrap";
import React from "react";

function ProductDetails({productId, setSelectedProduct, fetcher}) {
    const {data, error} = useSWR(`http://localhost:8080/products/${productId}`, fetcher);

    if (error) return <div>Échec du chargement des détails du produit</div>;
    if (!data) return <div>Chargement des détails du produit...</div>;

    return (
        <Row className="justify-content-center mt-4">
            <Col xs="12" md="8" lg="6">
                <Card style={{boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', borderRadius: '10px'}}>
                    <Card.Header className="text-center">
                        <h2>Détails du produit</h2>
                    </Card.Header>
                    <Card.Img
                        src={data.imageURL || '/images/placeholder.webp'}
                        alt={data.productName}
                        style={{
                            width: '200px',
                            height: '200px',
                            objectFit: 'cover',
                            borderTopLeftRadius: '10px',
                            borderTopRightRadius: '10px',
                            margin: '0 auto',
                        }}
                    />
                    <Card.Body className="text-center">
                        <Card.Title>{data.productName}</Card.Title>
                        <Card.Text><strong>Prix :</strong> {data.price} €</Card.Text>
                        <Card.Text><strong>Marque :</strong> {data.brand.brandName}</Card.Text>
                        <Button variant="secondary" onClick={() => setSelectedProduct(null)}>
                            Retour à la liste
                        </Button>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    );
}

export default ProductDetails;
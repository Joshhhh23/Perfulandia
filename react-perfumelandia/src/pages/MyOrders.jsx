import { useEffect, useState } from 'react';
import { Container, Accordion, Table, Badge, Spinner } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

export default function MyOrders() {
    const { user, token } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user?.email) {
            fetch(`http://localhost:8080/ordenes/mis-compras?email=${user.email}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            .then(res => res.json())
            .then(data => setOrders(data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
        }
    }, [user, token]);

    if(loading) return (
        <div style={{minHeight:'100vh', backgroundColor:'#0a0a0a', display:'flex', justifyContent:'center', alignItems:'center'}}>
            <Spinner animation="border" variant="warning" />
        </div>
    );

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#0a0a0a', paddingTop: '100px', color: 'white' }}>
            <Container style={{ maxWidth: '800px' }}>
                <h2 className="mb-4 text-center" style={{ fontFamily: "'Playfair Display', serif", color: '#d4af37' }}>
                    📦 Mis Compras
                </h2>
                
                {orders.length === 0 ? (
                    <div className="text-center p-5 border border-secondary rounded">
                        <h4 className="text-muted">Aún no tienes pedidos.</h4>
                        <p>¡Explora nuestro catálogo y encuentra tu esencia!</p>
                    </div>
                ) : (
                    <Accordion data-bs-theme="dark">
                        {orders.map(order => (
                            <Accordion.Item key={order.id} eventKey={order.id.toString()} style={{ marginBottom: '15px', border: '1px solid #333', background: '#151515' }}>
                                <Accordion.Header>
                                    <div className="d-flex justify-content-between w-100 me-3 align-items-center">
                                        <div>
                                            <strong>Pedido #{order.id}</strong>
                                            <span className="text-muted ms-3 small">{new Date(order.fecha).toLocaleDateString()}</span>
                                        </div>
                                        <div>
                                            <Badge bg="success" className="me-3">Pagado</Badge>
                                            <span style={{ color: '#d4af37', fontWeight: 'bold' }}>
                                                ${order.total.toLocaleString('es-CL')}
                                            </span>
                                        </div>
                                    </div>
                                </Accordion.Header>
                                <Accordion.Body style={{ backgroundColor: '#1a1a1a' }}>
                                    <h6 className="mb-3 text-muted">Detalle de productos:</h6>
                                    <Table size="sm" variant="dark" className="mb-0">
                                        <thead>
                                            <tr>
                                                <th>Producto</th>
                                                <th className="text-center">Cant.</th>
                                                <th className="text-end">Precio Unit.</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {order.detalles.map((detalle, idx) => (
                                                <tr key={idx}>
                                                    <td>{detalle.nombreProducto}</td>
                                                    <td className="text-center">{detalle.cantidad}</td>
                                                    <td className="text-end text-success">${detalle.precioUnitario.toLocaleString('es-CL')}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                </Accordion.Body>
                            </Accordion.Item>
                        ))}
                    </Accordion>
                )}
            </Container>
        </div>
    );
}
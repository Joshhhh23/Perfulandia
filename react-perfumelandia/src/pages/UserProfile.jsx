import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Nav, Tab, Alert, Badge } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

export default function UserProfile() {
    const { user } = useAuth();
    const goldColor = '#d4af37';
    
   
    const [direcciones, setDirecciones] = useState([]);
    const [pagos, setPagos] = useState([]);
    const [facturacion, setFacturacion] = useState({ rut: '', giro: '', razonSocial: '' });
    const [tickets, setTickets] = useState([]);
    const [msg, setMsg] = useState('');

    useEffect(() => {
        if (user?.email) {
            fetchData();
        }
       
    }, [user]);

    const fetchData = async () => {
        try {
           
            const safeRequest = async (url) => {
                try {
                    const res = await fetch(url);
                    if (!res.ok) return []; 
                    const data = await res.json();
                    return data;
                } catch (err) {
                    return [];
                }
            };

            // 1. Direcciones
            const dataDir = await safeRequest(`http://localhost:8080/api/profile/direcciones?email=${user.email}`);
            setDirecciones(Array.isArray(dataDir) ? dataDir : []);

            // 2. Pagos
            const dataPagos = await safeRequest(`http://localhost:8080/api/profile/pagos?email=${user.email}`);
            setPagos(Array.isArray(dataPagos) ? dataPagos : []);

            // 3. Facturación
            try {
                const resFac = await fetch(`http://localhost:8080/api/profile/facturacion?email=${user.email}`);
                if (resFac.ok) {
                    const dataFac = await resFac.json();
                    if (dataFac) setFacturacion(dataFac);
                }
            } catch (e) { console.log("Sin datos de facturación"); }

            // 4. Tickets
            const dataTickets = await safeRequest(`http://localhost:8080/api/profile/soporte?email=${user.email}`);
            setTickets(Array.isArray(dataTickets) ? dataTickets : []);

        } catch (e) { 
            console.error("Error general cargando perfil:", e); 
        }
    };

   

    const handleSaveAddress = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = {
            usuarioEmail: user.email,
            alias: formData.get('alias'),
            direccion: formData.get('direccion'),
            ciudad: formData.get('ciudad')
        };
        await fetch('http://localhost:8080/api/profile/direcciones', {
            method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(data)
        });
        e.target.reset();
        fetchData();
        setMsg('Dirección guardada con éxito');
    };

    const handleSavePayment = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const numero = formData.get('numero');
        const data = {
            usuarioEmail: user.email,
            tipo: formData.get('tipo'),
            ultimosDigitos: numero ? numero.slice(-4) : '0000',
            expiracion: formData.get('expiracion')
        };
        await fetch('http://localhost:8080/api/profile/pagos', {
            method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(data)
        });
        e.target.reset();
        fetchData();
        setMsg('Método de pago agregado');
    };

    const handleSaveBilling = async (e) => {
        e.preventDefault();
        const data = { ...facturacion, usuarioEmail: user.email };
        await fetch('http://localhost:8080/api/profile/facturacion', {
            method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(data)
        });
        setMsg('Datos de facturación actualizados');
    };

    const handleSupport = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = {
            usuarioEmail: user.email,
            tipoProblema: formData.get('tipo'),
            detalle: formData.get('detalle')
        };
        await fetch('http://localhost:8080/api/profile/soporte', {
            method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(data)
        });
        e.target.reset();
        fetchData();
        setMsg('Ticket de soporte creado.');
    };

    const handleDelete = async (id, type) => {
        if(!window.confirm("¿Eliminar?")) return;
        await fetch(`http://localhost:8080/api/profile/${type}/${id}`, { method: 'DELETE' });
        fetchData();
    };

    // Estilos
    const cardStyle = { backgroundColor: '#1a1a1a', border: '1px solid #333', color: 'white' };
    const inputStyle = { backgroundColor: '#252525', border: '1px solid #444', color: 'white' };
    const labelStyle = { color: goldColor, fontSize: '0.9rem', fontWeight: 'bold' };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#0a0a0a', paddingTop: '100px', color: 'white', paddingBottom: '50px' }}>
            <Container>
                <h2 className="mb-5 text-center" style={{ fontFamily: "'Playfair Display', serif", color: goldColor }}>Mi Cuenta</h2>
                
                {msg && <Alert variant="success" onClose={() => setMsg('')} dismissible>{msg}</Alert>}

                <Tab.Container defaultActiveKey="personal">
                    <Row>
                        <Col md={3} className="mb-4">
                            <Card style={{ ...cardStyle, border: `1px solid ${goldColor}` }}>
                                <Card.Body className="p-0">
                                    <Nav variant="pills" className="flex-column">
                                        {['Datos Personales', 'Direcciones', 'Métodos de Pago', 'Facturación', 'Soporte'].map((l, i) => (
                                            <Nav.Item key={i}><Nav.Link eventKey={['personal', 'addresses', 'payments', 'billing', 'support'][i]} style={{ color: 'white', padding: '15px 20px', borderBottom: '1px solid #333' }}>{l}</Nav.Link></Nav.Item>
                                        ))}
                                    </Nav>
                                </Card.Body>
                            </Card>
                        </Col>

                        <Col md={9}>
                            <Tab.Content>
                                {/* DATOS PERSONALES */}
                                <Tab.Pane eventKey="personal">
                                    <Card style={cardStyle} className="p-4">
                                        <h4 style={{ color: goldColor }}>👤 Información Personal</h4>
                                        <Form>
                                            <Form.Group className="mb-3"><Form.Label style={labelStyle}>Correo</Form.Label><Form.Control defaultValue={user?.email} readOnly style={{...inputStyle, opacity: 0.7}} /></Form.Group>
                                            <Form.Group className="mb-3"><Form.Label style={labelStyle}>Rol</Form.Label><Form.Control defaultValue={user?.role} readOnly style={{...inputStyle, opacity: 0.7}} /></Form.Group>
                                            <Button disabled style={{ backgroundColor: goldColor, border: 'none', color: 'black' }}>Datos gestionados por Admin</Button>
                                        </Form>
                                    </Card>
                                </Tab.Pane>

                                {/* DIRECCIONES */}
                                <Tab.Pane eventKey="addresses">
                                    <Card style={cardStyle} className="p-4 mb-4">
                                        <h4 style={{ color: goldColor }}>📍 Nueva Dirección</h4>
                                        <Form onSubmit={handleSaveAddress}>
                                            <Row>
                                                <Col><Form.Control name="alias" placeholder="Alias (Ej: Casa)" required style={inputStyle} /></Col>
                                                <Col><Form.Control name="ciudad" placeholder="Ciudad" required style={inputStyle} /></Col>
                                            </Row>
                                            <Form.Control name="direccion" placeholder="Calle y número" required style={{...inputStyle, marginTop: '10px'}} />
                                            <Button type="submit" className="mt-3" variant="outline-light">Guardar Dirección</Button>
                                        </Form>
                                    </Card>
                                    
                                    {direcciones.map(d => (
                                        <Card key={d.id} className="p-3 mb-2" style={{backgroundColor: '#222', border: '1px solid #444', color: 'white'}}>
                                            <div className="d-flex justify-content-between">
                                                <div><strong>{d.alias}</strong>: {d.direccion}, {d.ciudad}</div>
                                                <Button size="sm" variant="danger" onClick={() => handleDelete(d.id, 'direcciones')}>X</Button>
                                            </div>
                                        </Card>
                                    ))}
                                    {direcciones.length === 0 && <p className="text-muted">No tienes direcciones guardadas.</p>}
                                </Tab.Pane>

                                {/* PAGOS */}
                                <Tab.Pane eventKey="payments">
                                    <Card style={cardStyle} className="p-4 mb-4">
                                        <h4 style={{ color: goldColor }}>💳 Nuevo Método</h4>
                                        <Form onSubmit={handleSavePayment}>
                                            <Row className="mb-3">
                                                <Col><Form.Select name="tipo" style={inputStyle}><option>Visa</option><option>Mastercard</option></Form.Select></Col>
                                                <Col><Form.Control name="expiracion" placeholder="MM/YY" required style={inputStyle} /></Col>
                                            </Row>
                                            <Form.Control name="numero" placeholder="Número de Tarjeta" required style={inputStyle} maxLength="16" />
                                            <Button type="submit" className="mt-3" variant="outline-light">Guardar Tarjeta</Button>
                                        </Form>
                                    </Card>
                                    {pagos.map(p => (
                                        <div key={p.id} className="p-3 border rounded mb-2 d-flex justify-content-between align-items-center" style={{background: '#222', borderColor: '#444'}}>
                                            <span>💳 {p.tipo} terminada en <strong>{p.ultimosDigitos}</strong> (Exp: {p.expiracion})</span>
                                            <Button size="sm" variant="danger" onClick={() => handleDelete(p.id, 'pagos')}>X</Button>
                                        </div>
                                    ))}
                                    {pagos.length === 0 && <p className="text-muted">No hay métodos de pago guardados.</p>}
                                </Tab.Pane>

                                {/* FACTURACIÓN */}
                                <Tab.Pane eventKey="billing">
                                    <Card style={cardStyle} className="p-4">
                                        <h4 style={{ color: goldColor }}>🧾 Datos de Facturación</h4>
                                        <Form onSubmit={handleSaveBilling}>
                                            <Form.Group className="mb-3"><Form.Label style={labelStyle}>RUT / DNI</Form.Label><Form.Control value={facturacion.rut || ''} onChange={e => setFacturacion({...facturacion, rut: e.target.value})} style={inputStyle} /></Form.Group>
                                            <Form.Group className="mb-3"><Form.Label style={labelStyle}>Giro</Form.Label><Form.Control value={facturacion.giro || ''} onChange={e => setFacturacion({...facturacion, giro: e.target.value})} style={inputStyle} /></Form.Group>
                                            <Form.Group className="mb-3"><Form.Label style={labelStyle}>Razón Social</Form.Label><Form.Control value={facturacion.razonSocial || ''} onChange={e => setFacturacion({...facturacion, razonSocial: e.target.value})} style={inputStyle} /></Form.Group>
                                            <Button type="submit" style={{backgroundColor: goldColor, color: 'black', fontWeight: 'bold', border: 'none'}}>Actualizar Datos</Button>
                                        </Form>
                                    </Card>
                                </Tab.Pane>

                                {/* SOPORTE */}
                                <Tab.Pane eventKey="support">
                                    <Card style={cardStyle} className="p-4 mb-4">
                                        <h4 style={{ color: goldColor }}>🎧 Solicitar Soporte</h4>
                                        <Form onSubmit={handleSupport}>
                                            <Form.Select name="tipo" className="mb-3" style={inputStyle}><option>Pedido no llegó</option><option>Producto dañado</option><option>Error en cobro</option><option>Otro</option></Form.Select>
                                            <Form.Control as="textarea" name="detalle" rows={3} placeholder="Describe tu problema..." required style={inputStyle} />
                                            <Button type="submit" className="mt-3" variant="warning">Enviar Ticket</Button>
                                        </Form>
                                    </Card>
                                    <h5 className="text-white mb-3">Mis Tickets</h5>
                                    {tickets.map(t => (
                                        <Alert key={t.id} variant="dark" className="border-secondary">
                                            <Badge bg={t.estado === 'Resuelto' ? 'success' : 'warning'} className="me-2">{t.estado}</Badge>
                                            <span className="fw-bold">{t.tipoProblema}</span>: {t.detalle}
                                            <div className="text-muted small mt-1">{new Date(t.fecha).toLocaleDateString()}</div>
                                        </Alert>
                                    ))}
                                    {tickets.length === 0 && <p className="text-muted">No tienes tickets activos.</p>}
                                </Tab.Pane>
                            </Tab.Content>
                        </Col>
                    </Row>
                </Tab.Container>
            </Container>
        </div>
    );
}
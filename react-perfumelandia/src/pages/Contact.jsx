import { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert, Card } from 'react-bootstrap';

export default function Contact() {
    const [msg, setMsg] = useState('');
    const [errors, setErrors] = useState([]);

    const onSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        
        // Recopilar datos
        const data = {
            nombre: (formData.get('name') || '').trim(),
            email: (formData.get('email') || '').trim(),
            telefono: (formData.get('phone') || '').trim(),
            asunto: (formData.get('subject') || '').trim(),
            mensaje: (formData.get('message') || '').trim()
        };

        const errs = [];
        if(!data.nombre) errs.push('El nombre es obligatorio');
        if(!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errs.push('El correo es obligatorio y debe ser válido');
        if(!data.mensaje) errs.push('El mensaje es obligatorio');

        setErrors(errs);
        
        if(errs.length === 0) {
            try {
                // Enviar al Backend
                const response = await fetch('http://localhost:8080/mensajes', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });

                if (response.ok) {
                    setMsg('¡Mensaje enviado! Nos pondremos en contacto pronto.');
                    e.target.reset();
                } else {
                    setErrors(['Hubo un error al enviar el mensaje. Inténtalo de nuevo.']);
                }
            } catch (error) {
                console.error(error);
                setErrors(['Error de conexión con el servidor.']);
            }
        } else {
            setMsg('');
        }
    };

    // Estilos "Dark Luxury"
    const goldColor = '#d4af37';
    const inputStyle = {
        backgroundColor: 'rgba(26, 26, 26, 0.8)',
        border: '1px solid #333',
        color: 'white',
        borderRadius: '10px',
        padding: '12px'
    };

    const labelStyle = {
        color: '#ccc',
        marginBottom: '5px',
        fontSize: '0.9rem'
    };

    const cardStyle = {
        backgroundColor: 'rgba(17, 17, 17, 0.85)',
        border: `1px solid ${goldColor}`,
        borderRadius: '20px',
        color: 'white',
        height: '100%',
        backdropFilter: 'blur(5px)'
    };

    return (
        <div style={{ 
            minHeight: '100vh', 
            backgroundImage: "url('[https://img.freepik.com/vector-gratis/botella-perfume-cinta-dorada-sobre-negro_107791-2826.jpg](https://img.freepik.com/vector-gratis/botella-perfume-cinta-dorada-sobre-negro_107791-2826.jpg)')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
            paddingTop: '100px', 
            paddingBottom: '50px',
            position: 'relative'
        }}>
            <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.7)', zIndex: 0
            }}></div>

            <Container style={{ position: 'relative', zIndex: 1 }}>
                <div className="text-center mb-5">
                    <h2 style={{ fontFamily: "'Playfair Display', serif", color: goldColor, fontSize: '3rem', marginBottom: '10px', textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
                        Contáctanos
                    </h2>
                    <p style={{ color: '#ddd', fontSize: '1.1rem' }}>Estamos aquí para asesorarte en la elección de tu fragancia ideal.</p>
                </div>

                <Row className="g-5">
                    <Col md={5}>
                        <Card className="p-4 shadow-lg h-100" style={cardStyle}>
                            <Card.Body className="d-flex flex-column justify-content-center">
                                <h4 className="mb-4 fw-bold" style={{ color: 'white' }}>Información de Contacto</h4>
                                <div className="d-flex align-items-center mb-4">
                                    <div style={{ fontSize: '1.5rem', color: goldColor, marginRight: '15px', width: '30px' }}>📧</div>
                                    <div>
                                        <div className="fw-bold" style={{ color: goldColor }}>Email</div>
                                        <div className="text-white">contacto@perfulandia.cl</div>
                                    </div>
                                </div>
                                <div className="d-flex align-items-center mb-4">
                                    <div style={{ fontSize: '1.5rem', color: goldColor, marginRight: '15px', width: '30px' }}>📞</div>
                                    <div>
                                        <div className="fw-bold" style={{ color: goldColor }}>Teléfono</div>
                                        <div className="text-white">+56 2 2999 8877</div>
                                    </div>
                                </div>
                                <div className="d-flex align-items-center mb-4">
                                    <div style={{ fontSize: '1.5rem', color: goldColor, marginRight: '15px', width: '30px' }}>📍</div>
                                    <div>
                                        <div className="fw-bold" style={{ color: goldColor }}>Ubicación</div>
                                        <div className="text-white">Av. Apoquindo 4500, Las Condes<br/>Santiago, Chile</div>
                                    </div>
                                </div>
                                <hr style={{ borderColor: '#444' }} />
                                <div className="mt-3">
                                    <h5 style={{ color: 'white', marginBottom: '15px' }}>Síguenos</h5>
                                    <div className="d-flex gap-3">
                                        {['📷', '📘', '🎵', '🐦'].map((icon, i) => (
                                            <div key={i} style={{ width: '40px', height: '40px', borderRadius: '50%', border: `1px solid ${goldColor}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: goldColor, cursor: 'pointer', fontSize: '1.2rem', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                                                {icon}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col md={7}>
                        <div className="p-5 rounded shadow-lg" style={{ backgroundColor: 'rgba(21, 21, 21, 0.85)', border: '1px solid #222', backdropFilter: 'blur(5px)' }}>
                            <h3 className="mb-4 fw-bold" style={{ color: 'white' }}>Envíanos un mensaje</h3>
                            
                            {msg && <Alert variant="success" style={{ backgroundColor: 'rgba(25, 135, 84, 0.2)', borderColor: '#198754', color: '#75b798' }}>{msg}</Alert>}
                            {errors.length > 0 && <Alert variant="danger" style={{ backgroundColor: 'rgba(220, 53, 69, 0.2)', borderColor: '#dc3545', color: '#ea868f' }}>{errors.join('. ')}</Alert>}

                            <Form onSubmit={onSubmit} noValidate>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-4" controlId="name">
                                            <Form.Label style={labelStyle}>Nombre Completo *</Form.Label>
                                            <Form.Control name="name" placeholder="Ej: Juan Pérez" style={inputStyle} required />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-4" controlId="phone">
                                            <Form.Label style={labelStyle}>Teléfono</Form.Label>
                                            <Form.Control name="phone" placeholder="+56 9..." style={inputStyle} />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Form.Group className="mb-4" controlId="email">
                                    <Form.Label style={labelStyle}>Correo Electrónico *</Form.Label>
                                    <Form.Control type="email" name="email" placeholder="tu@email.com" style={inputStyle} required />
                                </Form.Group>

                                <Form.Group className="mb-4" controlId="subject">
                                    <Form.Label style={labelStyle}>Asunto</Form.Label>
                                    <Form.Control name="subject" placeholder="Consulta sobre..." style={inputStyle} />
                                </Form.Group>

                                <Form.Group className="mb-5" controlId="message">
                                    <Form.Label style={labelStyle}>Mensaje *</Form.Label>
                                    <Form.Control as="textarea" rows={5} name="message" placeholder="Escribe tu mensaje aquí..." style={inputStyle} required />
                                </Form.Group>

                                <div className="d-grid">
                                    <Button type="submit" size="lg" style={{ backgroundColor: goldColor, border: 'none', color: 'black', fontWeight: 'bold', borderRadius: '10px', padding: '15px', boxShadow: '0 4px 15px rgba(212, 175, 55, 0.3)' }}>
                                        ENVIAR MENSAJE
                                    </Button>
                                </div>
                            </Form>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}
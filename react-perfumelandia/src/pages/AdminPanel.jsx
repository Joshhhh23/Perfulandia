import { useState, useEffect } from 'react';
import { Container, Tabs, Tab, Table, Button, Modal, Form, Spinner, Alert, Card, Row, Col } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function AdminPanel() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [key, setKey] = useState('productos');
    const [productos, setProductos] = useState([]);
    const [pedidos, setPedidos] = useState([]);
    const [stats, setStats] = useState({
        ventasTotales: 0,
        pedidosTotales: 0,
        pedidosHoy: 0,
        productosTotales: 0
    });
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [nuevoPerfume, setNuevoPerfume] = useState({
        nombre: '',
        marca: '',
        precio: '',
        stock: '',
        imagenUrl: '',
        genero: 'hombre',
        aroma: 'citrico'
    });
    const [error, setError] = useState('');

    const goldColor = '#d4af37';

    // Protección de ruta: Solo admins
    useEffect(() => {
        if (user && user.role !== 'admin' && user.role !== 'ADMIN') {
            navigate('/productos');
        }
    }, [user, navigate]);

    // Carga de datos según la pestaña activa
    useEffect(() => {
        if (!user) return;

        if (key === 'resumen') {
            cargarEstadisticas();
        } else if (key === 'productos') {
            cargarProductos();
        } else if (key === 'pedidos') {
            cargarPedidos();
        }
    }, [key, user]);

    const getHeaders = () => {
        const token = localStorage.getItem('token');
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
    };

    const cargarEstadisticas = async () => {
        setLoading(true);
        try {
            const resPedidos = await fetch('http://localhost:8080/ordenes', { headers: getHeaders() });
            const resProductos = await fetch('http://localhost:8080/perfumes', { headers: getHeaders() });

            const pedidosData = resPedidos.ok ? await resPedidos.json() : [];
            const productosData = resProductos.ok ? await resProductos.json() : [];

            const totalVentas = pedidosData.reduce((sum, p) => sum + (p.total || 0), 0);
            const hoy = new Date().toLocaleDateString('es-CL');
            const pedidosHoy = pedidosData.filter(p => new Date(p.fecha).toLocaleDateString('es-CL') === hoy).length;

            setStats({
                ventasTotales: totalVentas,
                pedidosTotales: pedidosData.length,
                pedidosHoy,
                productosTotales: productosData.length
            });
            setPedidos(pedidosData);
            setProductos(productosData);
        } catch (err) {
            setError('Error cargando estadísticas');
        }
        setLoading(false);
    };

    const cargarProductos = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await fetch('http://localhost:8080/perfumes', { headers: getHeaders() });
            if (!res.ok) {
                const errMsg = await res.text();
                throw new Error(errMsg || 'No autorizado o error del servidor');
            }
            const data = await res.json();
            setProductos(data);
        } catch (err) {
            setError('No se pudieron cargar los productos: ' + err.message);
        }
        setLoading(false);
    };

    const cargarPedidos = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await fetch('http://localhost:8080/ordenes', { headers: getHeaders() });
            if (!res.ok) throw new Error('Error al cargar');
            const data = await res.json();
            setPedidos(data);
        } catch (err) {
            setError('No se pudieron cargar los pedidos');
        }
        setLoading(false);
    };

    const handleCrearPerfume = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:8080/perfumes', {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify({
                    nombre: nuevoPerfume.nombre,
                    marca: nuevoPerfume.marca,
                    precio: parseFloat(nuevoPerfume.precio),
                    stock: parseInt(nuevoPerfume.stock),
                    imagenUrl: nuevoPerfume.imagenUrl || '',
                    genero: nuevoPerfume.genero,
                    aroma: nuevoPerfume.aroma
                })
            });
            if (!res.ok) {
                const errMsg = await res.text();
                throw new Error(errMsg || 'Error al guardar');
            }
            setShowModal(false);
            setNuevoPerfume({
                nombre: '',
                marca: '',
                precio: '',
                stock: '',
                imagenUrl: '',
                genero: 'hombre',
                aroma: 'citrico'
            });
            cargarProductos();
        } catch (err) {
            setError('Error al crear el perfume: ' + err.message);
        }
    };

    const handleEliminar = async (id) => {
        if (!window.confirm('¿Eliminar este perfume permanentemente?')) return;
        
        try {
            const res = await fetch(`http://localhost:8080/perfumes/${id}`, {
                method: 'DELETE',
                headers: getHeaders()
            });

            if (!res.ok) throw new Error('Error al eliminar');
            
            setProductos(prevProductos => prevProductos.filter(p => p.id !== id));
            
        } catch (err) {
            console.error(err);
            setError('Error al eliminar el producto. Verifica la conexión.');
        }
    };

    // --- NUEVA FUNCIÓN: EDITAR STOCK ---
    const handleEditarStock = async (producto) => {
        const nuevoStock = window.prompt(`Editar Stock para: ${producto.nombre}\nActual: ${producto.stock}`, producto.stock);

        if (nuevoStock === null || nuevoStock === '') return;

        if (isNaN(nuevoStock) || Number(nuevoStock) < 0) {
            alert("Por favor ingresa un número válido mayor o igual a 0");
            return;
        }

        try {
            const res = await fetch(`http://localhost:8080/perfumes/${producto.id}/stock?cantidad=${nuevoStock}`, {
                method: 'PUT',
                headers: getHeaders()
            });

            if (res.ok) {
                setProductos(prev => prev.map(p => 
                    p.id === producto.id ? { ...p, stock: Number(nuevoStock) } : p
                ));
                alert("Stock actualizado correctamente ✅");
            } else {
                alert("Error al actualizar en el servidor");
            }
        } catch (error) {
            console.error(error);
            alert("Error de conexión");
        }
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#0a0a0a', color: 'white', paddingTop: '100px' }}>
            <Container>
                <h1 className="text-center mb-5" style={{ color: goldColor, fontFamily: "'Playfair Display', serif" }}>
                    PANEL CONTROL
                </h1>

                {error && <Alert variant="danger">{error}</Alert>}

                <Tabs activeKey={key} onSelect={(k) => setKey(k)} className="mb-5" fill variant="pills">
                    <Tab eventKey="resumen" title="📊 Resumen">
                        {loading ? (
                            <div className="text-center py-5"><Spinner animation="border" variant="warning" /></div>
                        ) : (
                            <>
                                <Row className="g-4 mb-5">
                                    <Col md={3}>
                                        <Card className="text-white text-center" style={{ background: 'linear-gradient(135deg, #d4af37, #b8860b)', border: 'none', borderRadius: '15px' }}>
                                            <Card.Body>
                                                <h5>Ventas Totales</h5>
                                                <h2>${stats.ventasTotales.toLocaleString('es-CL')}</h2>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                    <Col md={3}>
                                        <Card className="text-white text-center bg-primary" style={{ borderRadius: '15px' }}>
                                            <Card.Body>
                                                <h5>Pedidos</h5>
                                                <h2>{stats.pedidosTotales}</h2>
                                                <small>{stats.pedidosHoy} hoy</small>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                    <Col md={3}>
                                        <Card className="text-white text-center bg-dark" style={{ border: '1px solid #d4af37', borderRadius: '15px' }}>
                                            <Card.Body>
                                                <h5>Productos</h5>
                                                <h2>{stats.productosTotales}</h2>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                    <Col md={3}>
                                        <Card className="text-white text-center bg-success" style={{ borderRadius: '15px' }}>
                                            <Card.Body>
                                                <h5>Usuarios</h5>
                                                <h2>48</h2>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col lg={8}>
                                        <Card className="bg-dark border-secondary" style={{ borderRadius: '15px' }}>
                                            <Card.Body>
                                                <h5 className="text-warning">📈 Ventas Últimos 30 Días</h5>
                                                <div style={{ height: '300px', background: '#111', borderRadius: '10px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', padding: '20px' }}>
                                                    {[15, 22, 18, 30, 45, 38, 52, 68, 55, 75].map((v, i) => (
                                                        <div key={i} style={{ width: '35px', height: `${v}%`, background: 'linear-gradient(to top, #00ff88, #00aa66)', borderRadius: '8px' }}></div>
                                                    ))}
                                                </div>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                    <Col lg={4}>
                                        <Card className="bg-dark border-secondary" style={{ borderRadius: '15px' }}>
                                            <Card.Body>
                                                <h5 className="text-info">📊 Pedidos Última Semana</h5>
                                                <div style={{ height: '300px', padding: '20px' }}>
                                                    {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((dia, i) => (
                                                        <div key={i} className="d-flex align-items-center mb-3">
                                                            <span className="text-muted me-3" style={{ width: '40px' }}>{dia}</span>
                                                            <div className="flex-grow-1 bg-secondary rounded" style={{ height: '25px' }}>
                                                                <div style={{ width: `${[3,5,7,12,18,15,22][i]*5}%`, height: '100%', background: '#00ff88', borderRadius: '10px' }}></div>
                                                            </div>
                                                            <span className="ms-3 text-success fw-bold">{[3,5,7,12,18,15,22][i]}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                </Row>
                            </>
                        )}
                    </Tab>

                    <Tab eventKey="productos" title="🧴 Productos">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h3>Inventario</h3>
                            <Button style={{ backgroundColor: goldColor, border: 'none', color: 'black', fontWeight: 'bold' }} onClick={() => setShowModal(true)}>
                                + Nuevo Perfume
                            </Button>
                        </div>
                        {loading ? (
                            <div className="text-center py-5"><Spinner animation="border" variant="warning" /></div>
                        ) : productos.length === 0 ? (
                            <p className="text-center text-muted">No hay productos registrados.</p>
                        ) : (
                            <Table striped bordered hover variant="dark">
                                <thead>
                                    <tr>
                                        <th>Nombre</th>
                                        <th>Marca</th>
                                        <th>Precio</th>
                                        <th>Stock</th>
                                        <th>Género</th>
                                        <th>Aroma</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {productos.map(p => (
                                        <tr key={p.id}>
                                            <td>{p.nombre}</td>
                                            <td>{p.marca}</td>
                                            <td>${parseFloat(p.precio).toLocaleString('es-CL')}</td>
                                            <td style={{ color: p.stock < 5 ? '#ff4444' : '#00ff88', fontWeight: 'bold' }}>
                                                {p.stock}
                                            </td>
                                            <td>{p.genero}</td>
                                            <td>{p.aroma}</td>
                                            <td>
                                                <Button 
                                                    variant="outline-warning" 
                                                    size="sm" 
                                                    className="me-2"
                                                    onClick={() => handleEditarStock(p)}
                                                    title="Editar Stock"
                                                >
                                                    ✏️
                                                </Button>
                                                <Button size="sm" variant="danger" onClick={() => handleEliminar(p.id)}>
                                                    🗑
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        )}
                    </Tab>

                    <Tab eventKey="pedidos" title="📦 Pedidos">
                        <h3 className="mb-4">Todos los Pedidos</h3>
                        {loading ? (
                            <div className="text-center py-5"><Spinner animation="border" variant="warning" /></div>
                        ) : pedidos.length === 0 ? (
                            <p className="text-center text-muted">No hay pedidos aún.</p>
                        ) : (
                            <Table striped bordered hover variant="dark">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Cliente</th>
                                        <th>Total</th>
                                        <th>Fecha</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pedidos.map(p => (
                                        <tr key={p.id}>
                                            <td>{p.id}</td>
                                            <td>{p.usuarioEmail}</td>
                                            <td>${p.total.toLocaleString('es-CL')}</td>
                                            <td>{new Date(p.fecha).toLocaleDateString('es-CL')}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        )}
                    </Tab>

                    <Tab eventKey="mensajes" title="✉️ Mensajes">
                        <div className="text-center py-5 text-muted">
                            <p>Sistema de mensajes y soporte próximamente...</p>
                        </div>
                    </Tab>
                </Tabs>

                <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                    <Modal.Header closeButton style={{ backgroundColor: '#1a1a1a', borderBottom: `2px solid ${goldColor}` }}>
                        <Modal.Title style={{ color: goldColor }}>+ Nuevo Perfume</Modal.Title>
                    </Modal.Header>
                    <Modal.Body style={{ backgroundColor: '#696b59ff' }}>
                        <Form onSubmit={handleCrearPerfume}>
                            <Form.Group className="mb-3">
                                <Form.Label>Nombre</Form.Label>
                                <Form.Control value={nuevoPerfume.nombre} onChange={e => setNuevoPerfume({...nuevoPerfume, nombre: e.target.value})} required />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Marca</Form.Label>
                                <Form.Control value={nuevoPerfume.marca} onChange={e => setNuevoPerfume({...nuevoPerfume, marca: e.target.value})} required />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Precio</Form.Label>
                                <Form.Control type="number" value={nuevoPerfume.precio} onChange={e => setNuevoPerfume({...nuevoPerfume, precio: e.target.value})} required />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Stock</Form.Label>
                                <Form.Control type="number" value={nuevoPerfume.stock} onChange={e => setNuevoPerfume({...nuevoPerfume, stock: e.target.value})} required />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Género</Form.Label>
                                <Form.Select value={nuevoPerfume.genero} onChange={e => setNuevoPerfume({...nuevoPerfume, genero: e.target.value})}>
                                    <option value="hombre">Hombre</option>
                                    <option value="mujer">Mujer</option>
                                    <option value="unisex">Unisex</option>
                                </Form.Select>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Aroma</Form.Label>
                                <Form.Select value={nuevoPerfume.aroma} onChange={e => setNuevoPerfume({...nuevoPerfume, aroma: e.target.value})}>
                                    <option value="citrico">Cítrico</option>
                                    <option value="dulce">Dulce</option>
                                    <option value="amaderado">Amaderado</option>
                                    <option value="floral">Floral</option>
                                    <option value="oriental">Oriental</option>
                                    <option value="fresco">Fresco</option>
                                </Form.Select>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>URL de Imagen</Form.Label>
                                <Form.Control value={nuevoPerfume.imagenUrl} onChange={e => setNuevoPerfume({...nuevoPerfume, imagenUrl: e.target.value})} placeholder="https://ejemplo.com/imagen.jpg" />
                            </Form.Group>
                            <Button type="submit" className="w-100" style={{ backgroundColor: goldColor, border: 'none', color: 'black', fontWeight: 'bold' }}>
                                Guardar Perfume
                            </Button>
                        </Form>
                    </Modal.Body>
                </Modal>
            </Container>
        </div>
    );
}
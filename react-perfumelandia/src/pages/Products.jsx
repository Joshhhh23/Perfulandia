import { useState, useEffect } from 'react'; 
import { Container, Row, Col, Spinner, Alert } from 'react-bootstrap';
import Filters from '../components/products/Filters';
import ProductCard from '../components/products/ProductCard';


import { useCart } from '../context/AppContext'; 

export default function Products() {
    const [productos, setProductos] = useState([]); 
    const [productosFiltrados, setProductosFiltrados] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    
    const { addToCart } = useCart();

    const [filtros, setFiltros] = useState({
        gender: [],
        brand: [],
        aroma: [],
        priceMax: 0
    });

    useEffect(() => {
        const fetchProductos = async () => {
            try {
                const response = await fetch('http://localhost:8080/perfumes'); 
                if (!response.ok) throw new Error('Error al cargar productos');
                
                const data = await response.json();
                setProductos(data);
                setProductosFiltrados(data); 
            } catch (err) {
                console.error(err);
                setError('Hubo un problema cargando el catálogo.');
            } finally {
                setLoading(false);
            }
        };
        fetchProductos();
    }, []);

    const uniqueBrands = [...new Set(productos.map(p => p.marca))];

    useEffect(() => {
        let resultado = productos;

        if (filtros.gender.length > 0) {
            resultado = resultado.filter(p => 
                p.genero && filtros.gender.includes(p.genero.toLowerCase())
            );
        }

        if (filtros.brand.length > 0) {
            resultado = resultado.filter(p => filtros.brand.includes(p.marca));
        }

        if (filtros.aroma.length > 0) {
            resultado = resultado.filter(p => 
                p.aroma && filtros.aroma.includes(p.aroma.toLowerCase())
            );
        }

        if (filtros.priceMax > 0) {
            resultado = resultado.filter(p => p.precio <= filtros.priceMax);
        }

        setProductosFiltrados(resultado);
    }, [filtros, productos]);

    const handleFilterChange = ({ type, name, value, checked }) => {
        setFiltros(prev => {
            if (type === 'priceMax') {
                return { ...prev, priceMax: Number(value) };
            }

            const currentList = prev[type] || [];
            let newList;

            if (checked) {
                newList = [...currentList, name.toLowerCase()];
            } else {
                newList = currentList.filter(item => item !== name.toLowerCase());
            }

            return { ...prev, [type]: newList };
        });
    };

    const limpiarFiltros = () => {
        setFiltros({
            gender: [],
            brand: [],
            aroma: [],
            priceMax: 0
        });
        document.querySelectorAll('input[type=checkbox]').forEach(el => el.checked = false);
        document.querySelectorAll('input[type=number]').forEach(el => el.value = '');
    };

    const handleAddToCart = (producto) => {
        if (addToCart) {
            addToCart(producto);
            
            console.log("Añadido:", producto.nombre);
        } else {
            console.error("Error: addToCart no está disponible.");
        }
    };

    if (loading) return <div className="text-center mt-5"><Spinner animation="border" variant="warning" /></div>;
    if (error) return <Alert variant="danger" className="m-5">{error}</Alert>;

    return (
        <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh', paddingBottom: '50px' }}>
            <div className="bg-dark text-warning text-center py-4 mb-4">
                <h2 style={{ fontFamily: "'Playfair Display', serif" }}>Catálogo Exclusivo</h2>
            </div>

            <Container fluid className="px-4">
                <Row>
                    <Col md={3} lg={2} className="mb-4">
                        <Filters 
                            brands={uniqueBrands}
                            onFilterChange={handleFilterChange}
                            onClear={limpiarFiltros}
                        />
                    </Col>

                    <Col md={9} lg={10}>
                        <Row>
                            {productosFiltrados.length > 0 ? (
                                productosFiltrados.map((producto) => (
                                    <Col key={producto.id} sm={6} md={4} lg={3} className="mb-4">
                                        <ProductCard 
                                            producto={producto} 
                                            onAdd={handleAddToCart} 
                                            onReload={() => window.location.reload()}
                                        />
                                    </Col>
                                ))
                            ) : (
                                <Col className="text-center py-5">
                                    <h4>No encontramos perfumes con esos filtros 🧐</h4>
                                    <p className="text-muted">Intenta ajustar tu búsqueda.</p>
                                </Col>
                            )}
                        </Row>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}
import { Card, Button } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';

export default function ProductCard({ producto, onAdd, onReload }) {
  const { user, token } = useAuth();

  const product = producto;

  if (!product) return null;

  const stock = product.stock ?? 0;
  const hasStock = stock > 0;

  const handleDelete = async () => {
    if (!window.confirm("¿Estás seguro de eliminar este perfume?")) return;

    try {
      
      const response = await fetch(
        `http://localhost:8080/perfumes/${product.id}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.ok) {
        alert("Eliminado con éxito");
        
        if (onReload) {
            onReload();
        } else {
            
            window.location.reload(); 
        }
      } else {
        alert("Error al eliminar");
      }
    } catch (e) {
      console.error(e);
      alert("Error de conexión");
    }
  };

  return (
    <Card className="h-100 shadow-sm" style={{ opacity: hasStock ? 1 : 0.6 }}>
      <Card.Img
        variant="top"
        src={product.imagenUrl || "https://placehold.co/400x300?text=Perfume"}
        style={{
          height: '250px',
          objectFit: 'contain', 
          padding: '10px',
          filter: hasStock ? 'none' : 'grayscale(100%)'
        }}
      />

      <Card.Body className="d-flex flex-column">
        <Card.Title>{product.nombre}</Card.Title>
        <small className="text-muted">
            {product.marca} | {product.genero}
        </small>

        <h5 className="mt-3 text-warning">
          ${Number(product.precio).toLocaleString('es-CL')}
        </h5>

        <p className="mb-2">
          {hasStock ? 
            <span style={{color: '#28a745'}}>📦 Stock: {stock}</span> : 
            <span style={{color: '#dc3545'}}>🚫 Agotado</span>
          }
        </p>

        <div className="mt-auto d-flex gap-2">
          <Button
            className="w-100"
            variant="primary"
            
            onClick={() => hasStock && onAdd && onAdd(product)}
            disabled={!hasStock}
          >
            {hasStock ? 'Añadir al Carrito' : 'Sin Stock'}
          </Button>

          
          {user?.role === 'admin' && (
            <Button variant="danger" onClick={handleDelete}>
              🗑
            </Button>
          )}
        </div>
      </Card.Body>
    </Card>
  );
}
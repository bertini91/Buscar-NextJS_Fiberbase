
import DetalleProducto from "../components/layout/DetalleProducto";
import Layout from "../components/layout/Layout";
import useProductos from "../hooks/useProductos";


export default function Populares() {
  const {productos} = useProductos('votos');

  return (
    <div>
      <Layout>
        <div className="listado-productos">
          <div className="contenedor">
            <ul className="bg-white">
              {productos.map((producto) => (
                <DetalleProducto
                  key={producto.id}
                  producto={producto}
                ></DetalleProducto>
              ))}
            </ul>
          </div>
        </div>
      </Layout>
    </div>
  );
}
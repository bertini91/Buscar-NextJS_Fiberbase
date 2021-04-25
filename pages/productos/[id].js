import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { es } from "date-fns/locale";
import Layout from "../../components/layout/Layout";
import { FirebaseContext } from "../../firebase";
import Error404 from "../../components/layout/Error404";
import styled from "@emotion/styled";
import { css } from "@emotion/react";
import { Campo, InputSubmit } from "../../components/ui/Formulario";
import Boton from "../../components/ui/Boton";

//Los styled components
const ContenedorProducto = styled.div`
  img {
    border-radius: 10px;
  }
  @media (min-width: 768px) {
    display: grid;
    grid-template-columns: 2fr 1fr;
    column-gap: 2rem;
  }
`;

const Producto = () => {
  //State del componente
  const [producto, setProducto] = useState({});
  const [error, setError] = useState(false);
  const [comentario, setComentario] = useState({});
  const [consultarDB, setConsultarDB] = useState(true);

  //Router para obtener el id actual
  const router = useRouter();
  const {
    query: { id },
  } = router;

  //context de firebase
  const { firebase, usuario } = useContext(FirebaseContext);

  useEffect(() => {
    if (id && consultarDB) {
      const obtenerProducto = async () => {
        const productoQuery = await firebase.db.collection("productos").doc(id);
        const producto = await productoQuery.get();
        if (producto.exists) {
          setProducto(producto.data());
          setConsultarDB(false);
        } else {
          setError(true);
          setConsultarDB(false);
        }
      };
      obtenerProducto();
    }
  }, [id]);

  if (Object.keys(producto).length === 0 && !error) return "Cargando..";

  const {
    /* id, */
    comentarios,
    creado,
    descripcion,
    empresa,
    nombre,
    url,
    urlImg,
    votos,
    creador,
    haVotado,
  } = producto;

  //Administrar y validar los votos
  const votarProducto = () => {
    if (!usuario) {
      return router.push("/login");
    }
    //Obtener y sumar el voto
    const nuevoTotal = votos + 1;

    //Verificar si el usuario actual ha votado
    if (haVotado.includes(usuario.uid)) {
      return;
    }

    //Guardar el id del usuario que ha votado
    const nuevoHaVotado = [...haVotado, usuario.uid];

    //Actualizar DB
    firebase.db
      .collection("productos")
      .doc(id)
      .update({ votos: nuevoTotal, haVotado: nuevoHaVotado });

    //Actualizar el state
    setProducto({ ...producto, votos: nuevoTotal });

    //Se debe consultar a la Base de Datos
    setConsultarDB(true);
  };

  //Funciones para crear comentarios
  const comentarioChange = (e) => {
    setComentario({ ...comentario, [e.target.name]: e.target.value });
  };

  // Identificar si el comentario es del creador del producto
  const esCreador = (id) => {
    if (creador.id === id) {
      return true;
    }
  };

  const agregarComentario = (e) => {
    e.preventDefault();
    if (!usuario) {
      return router.push("/login");
    }
    //Informacion extra al comentario
    comentario.usuarioId = usuario.uid;
    comentario.usuarioNombre = usuario.displayName;
    // Tomar copia de comentarios y agregarlos al arreglo
    const nuevosComentarios = [...comentarios, comentario];

    //Actualizar el BD
    firebase.db
      .collection("productos")
      .doc(id)
      .update({ comentarios: nuevosComentarios });

    //Actualizar el state
    setProducto({ ...producto, comentarios: nuevosComentarios });

    //Se debe consultar a la Base de Datos
    setConsultarDB(true);
  };

  const CreadorProducto = styled.p`
    padding: 0.5rem 2rem;
    background-color: #da552f;
    color: #fff;
    text-transform: uppercase;
    font-weight: bold;
    display: inline-block;
    text-align: center;
  `;

  //Funcion que revisa que el creador del producto sea el que esta autenticado
  const puedeBorrar = () => {
    if (!usuario) return false;
    if (creador.id === usuario.uid) return true;
  };

  //Elimina un producto de la DB
  const eliminarProducto = async () => {
    if (!usuario) {
      return router.push("/login");
    }
    if (creador.id !== usuario.uid) return router.push("/login");
    try {
      await firebase.db.collection("productos").doc(id).delete();
      router.push("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout>
      <>
        {error ? (
          <Error404></Error404>
        ) : (
          <div className="contenedor">
            <h1
              css={css`
                text-align: center;
                margin-top: 4rem;
                font-family: cursive;
                text-decoration-line: underline;
              `}
            >
              {nombre}
            </h1>
            <ContenedorProducto>
              <div>
                <div css={css`display: flex; justify-content: space-between;`}>
                  <p>
                    <strong>Publicado por: </strong> {" "}
                    {creador.nombre} - {empresa}
                  </p>
                  <p>
                    <strong>Publicado hace: </strong>{" "}
                    {formatDistanceToNow(new Date(creado), { locale: es })}
                  </p>
                </div>

                <img src={urlImg} />
                <p>{descripcion}</p>
                {usuario && (
                  <>
                    <h2>Agrega tu comentario</h2>
                    <form onSubmit={agregarComentario}>
                      <Campo>
                        <input
                          type="text"
                          name="mensaje"
                          onChange={comentarioChange}
                        />
                      </Campo>
                      <InputSubmit type="submit" value="Agregar Comentario" />
                    </form>
                  </>
                )}
                <h2
                  css={css`
                    margin: 2rem 0;
                  `}
                >
                  Comentarios
                </h2>
                {comentarios.length === 0 ? (
                  "Aún no hay comentarios"
                ) : (
                  <ul>
                    {comentarios.map((comentario, i) => (
                      <li
                        key={`${comentario.usuarioId}-${i}`}
                        css={css`
                          border: 1px solid #e1e1e1;
                          border-radius: 5px;
                          padding: 2rem;
                        `}
                      >
                        <p>{comentario.mensaje}</p>
                        <p css={css`padding-left: 1rem;`}>
                          Escrito por:{" "}
                          <span
                            css={css`
                              font-weight: bold;
                            `}
                          >
                            {comentario.usuarioNombre}
                          </span>
                        </p>
                        {esCreador(comentario.usuarioId) && (
                          <CreadorProducto>Es creador</CreadorProducto>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <aside
                css={css`
                  padding-top: 20rem;
                `}
              >
                <Boton target="_blank" bgColor="true" href={url}>
                  Visitar URL
                </Boton>

                <div
                  css={css`
                    margin-top: 5rem;
                  `}
                >
                  <p
                    css={css`
                      text-align: center;
                      font-size: 25px;
                      font-family: cursive;
                    `}
                  >
                    <strong>{votos} Votos</strong>
                  </p>
                  {usuario && <Boton onClick={votarProducto}>Votar</Boton>}
                </div>
              </aside>
            </ContenedorProducto>
            {puedeBorrar() && (
              <Boton onClick={eliminarProducto}>Eliminar Producto</Boton>
            )}
          </div>
        )}
      </>
    </Layout>
  );
};

export default Producto;

import React from "react";
import styled from "@emotion/styled";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { es } from "date-fns/locale";
import { css } from "@emotion/react";
import Link from "next/link";

const Imagen = styled.img`
  width: 200px;
  border-radius: 5px;
`;

const Producto = styled.li`
  padding: 4rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e1e1e1;
`;
const DescripcionProducto = styled.div`
  flex: 0 1 600px;
  display: grid;
  grid-template-columns: 1fr 3fr;
  column-gap: 2rem;
`;

const Titulo = styled.a`
  font-size: 2rem;
  font-weight: bold;
  margin: 0;
  :hover {
    cursor: pointer;
  }
`;

const TextoDescripcion = styled.p`
  font-size: 1.6rem;
  margin: 0;
  color: #888;
`;

const Comentarios = styled.div`
  margin-top: 2rem;
  display: flex;
  align-items: center;
  div {
    border-radius: 15px;
    display: flex;
    align-items: center;
    border: 1px solid #e1e1e1;
    padding: 0.3rem 1rem;
    margin-right: 2rem;
  }
  img {
    width: 2rem;
    margin-right: 2rem;
  }
  p {
    font-size: 1.6rem;
    margin-right: 1rem;
    font-weight: 700;
    &:last-of-type {
      margin: 0;
    }
  }
`;

const Votos = styled.div`
  flex: 0 0 auto;
  text-align: center;
  border: 1px solid #e1e1e1;
  border-radius: 10px;
  padding: 1rem 3rem;
  div {
    font-size: 2rem;
  }
  p {
    margin: 0;
    font-size: 2rem;
    font-weight: 700;
  }
`;

const DetalleProducto = ({ producto }) => {
  const {
    id,
    comentarios,
    creado,
    descripcion,
    empresa,
    nombre,
    url,
    urlImg,
    votos,
  } = producto;

  return (
    <Producto>
      <DescripcionProducto>
        <div css={css`display: flex; align-items:center;`}>
          <Imagen src={urlImg} alt={nombre} />
        </div>
        <div css= {css`margin-left: 1rem;`}>
          <Link href="/productos/[id]" as={`/productos/${id}`}>
            <Titulo>{nombre}</Titulo>
          </Link>
          <TextoDescripcion>{descripcion}</TextoDescripcion>
          <Comentarios>
            <div>
              <img src="/static/img/comentario.png" />
              <p>{comentarios.length}</p>
            </div>
          </Comentarios>
          <p>
            <strong>Publicado hace: </strong>
            {formatDistanceToNow(new Date(creado), { locale: es })}
          </p>
        </div>
      </DescripcionProducto>

      <Votos>
        <div>&#9650;</div>
        <p>{votos}</p>
      </Votos>
    </Producto>
  );
};

export default DetalleProducto;

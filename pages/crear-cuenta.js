import styled from "@emotion/styled";
import Layout from "../components/layout/Layout";

const Heading = styled.h1`
  color: red;
`;

export default function CrearCuenta() {
  return (
    <div>
      <Layout>
        <Heading>Crear Cuenta</Heading>
      </Layout>
    </div>
  );
}

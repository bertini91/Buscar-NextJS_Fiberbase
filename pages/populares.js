import styled from "@emotion/styled";
import Layout from "../components/layout/Layout";

const Heading = styled.h1`
  color: red;
`;

export default function Populares() {
  return (
    <div>
      <Layout>
        <Heading>Populares</Heading>
      </Layout>
    </div>
  );
}
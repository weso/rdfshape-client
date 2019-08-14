import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import ServerHost from "./ServerHost";
import DataTabs from "./DataTabs"
import Form from "react-bootstrap/Form";

class DataVisualize extends React.Component {
 render() {
     const infoUrl = ServerHost() + "/data/visualize"
     return (
       <Container>
         <h1>Visualize RDF data</h1>
         <Form onSubmit={infoUrl}>
         <DataTabs />
         <Button variant="primary">Visualize</Button>
         </Form>
       </Container>
     );
 }
}

export default DataVisualize;

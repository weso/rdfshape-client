import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import ServerHost from "./ServerHost";
import DataTabs from "./DataTabs"
import QueryTabs from "./QueryTabs"
import Form from "react-bootstrap/Form";

class DataQuery extends React.Component {
 render() {
     const infoUrl = ServerHost() + "/data/visualize"
     return (
       <Container>
         <h1>Query RDF data</h1>
         <Form onSubmit={infoUrl}>
             <DataTabs />
             <QueryTabs />
         <Button variant="primary">Run Query</Button>
         </Form>
       </Container>
     );
 }
}

export default DataQuery;

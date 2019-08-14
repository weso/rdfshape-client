import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import ServerHost from "./ServerHost";
import InputTabs from "./InputTabs"
import Form from "react-bootstrap/Form";

class DataExtract extends React.Component {
 render() {
     const infoUrl = ServerHost() + "/data/extract"
     return (
       <Container>
         <h1>Extract Schema from RDF data</h1>
         <Form onSubmit={infoUrl}>
             <InputTabs byTextName="RDF data"
                        byTextPlaceholder="RDF data..."
                        byURLName="URL data"
                        byURLPlaceholder="http://..."
                        byFileName="Data file"
             />
         <Button variant="primary">Extract schema</Button>
         </Form>
       </Container>
     );
 }
}

export default DataExtract;

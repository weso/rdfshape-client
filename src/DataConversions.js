import React from 'react';
import Container from 'react-bootstrap/Container';
import DataConversionsForm from "./DataConversionsForm"

class DataConversions extends React.Component {
 render() {
     return (
       <Container>
         <h1>RDF Data conversions</h1>
         <DataConversionsForm />
       </Container>
     );
 }
}

export default DataConversions;

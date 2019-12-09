import React, {useReducer, useEffect, useState} from 'react';
import Container from 'react-bootstrap/Container';
import DataTabs from "../data/DataTabs"
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import {InitialData, mkDataTabs, paramsFromStateData} from "../data/Data";

function SHACLValidate(props) {
    const [shacl, setShacl] = useState(InitialData);
    const [data, setData] = useState(InitialData);

    function handleSubmit(event) {
        event.preventDefault();
        const paramsShacl = paramsFromStateData(shacl);
        const paramsData = paramsFromStateData(data);
    }

    return (
        <Container>
            <h1>Validate RDF data with SHACL</h1>
            <Form onSubmit={handleSubmit}>
                {mkDataTabs(data,setData)}
                {mkDataTabs(shacl,setShacl, "Shapes graph (SHACL)")}
                <Button variant="primary">Validate</Button>
            </Form>
        </Container>
    );
}

export default SHACLValidate;

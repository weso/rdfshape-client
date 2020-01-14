import React, {useState} from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import InputEntitiesByText from "../components/InputEntitiesByText";
import Table from "react-bootstrap/Table";

function TestSearch(props) {
    const [entities, setEntities] = useState([]);

    return (
        <Container fuild={true}>
            <h1>Select wikidata item</h1>
            <Row>
                <Col>
                    <InputEntitiesByText
                        entities={entities}
                        onChange={setEntities}
                    />
                </Col>
            </Row>
            <Row>
                <Col>
                    <Table>
                      { entities.map(e => <tr><td>{e.label}</td><td>{e.uri}</td><td>{e.descr}</td></tr>)}
                    </Table>
                </Col>
            </Row>
        </Container>
    );
}

export default TestSearch;

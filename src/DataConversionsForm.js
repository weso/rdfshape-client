import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import ByURL from './ByURL';
import ByFile from './ByFile';
import ByText from './ByText';



class DataConversionsForm extends React.Component {
    render() {
        return (
            <Form onSubmit={this.handleSubmit}>
                <Form.Group>
                    <Tabs defaultActiveKey="byText" transition={false} id="dataTabs">
                        <Tab eventKey="byText" title="by Input">
                            <ByText name="RDF data"/>
                        </Tab>
                        <Tab eventKey="byURL" title="By URL">
                            <ByURL name="Data URL" placeholder="http://..."/>
                        </Tab>
                        <Tab eventKey="byFile" title="By File">
                            <ByFile name="RDF data file"/>
                        </Tab>
                    </Tabs>
                </Form.Group>
                <Button variant="primary">Submit</Button>
            </Form>
        );
    }
}

export default DataConversionsForm;
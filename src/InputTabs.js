import React from 'react';
import Form from 'react-bootstrap/Form';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import ByURL from './ByURL';
import ByFile from './ByFile';
import ByText from './ByText';
import SelectDataFormat from "./SelectDataFormat";

class InputTabs extends React.Component {
    constructor(props) {
        super(props);
        this.handleByTextChange = this.handleByTextChange.bind(this);
    }

    handleByTextChange(e) {
        this.props.handleByTextChange(e.target.value);
    }

    render() {
        return (
         <Form.Group>
          <Form.Label>{this.props.name}</Form.Label>
          <Tabs defaultActiveKey="byText" transition={false} id="dataTabs">
            <Tab eventKey="byText" title="by Input">
            <ByText name={this.props.byTextName}
                    valueTextArea={this.props.valueTextArea}
                    placeholder={this.props.byTextPlaceholder}
                    handleByTextChange={this.props.handleByTextChange}
            />
           </Tab>
           <Tab eventKey="byURL" title="By URL">
             <ByURL name={this.props.byURLName} placeholder={this.props.byURLPlaceholder}/>
           </Tab>
           <Tab eventKey="byFile" title="By File">
             <ByFile name={this.props.byFileName}/>
            </Tab>
         </Tabs>
         <SelectDataFormat />
         </Form.Group>
        );
    }
}

export default InputTabs;
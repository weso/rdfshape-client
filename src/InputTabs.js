import React from 'react';
import Form from 'react-bootstrap/Form';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import ByURL from './ByURL';
import ByFile from './ByFile';
import ByText from './ByText';

class InputTabs extends React.Component {
    constructor(props) {
        super(props);
        this.handleByTextChange = this.handleByTextChange.bind(this);
        this.handleTabChange = this.handleTabChange.bind(this);
        this.handleUrlChange = this.handleUrlChange.bind(this);
        this.state = { activeTab: this.props.activeTab }
    }

    handleByTextChange(e) {
        this.props.handleByTextChange(e.target.value);
    }
    handleUrlChange(e) {
        this.props.handleByTextChange(e.target.value);
    }
    handleTabChange(e) {
        console.log("Tab change " + e);
        this.setState( { activeTab: e })
        this.props.handleTabChange(e)
    }

    render() {
        return (
         <Form.Group>
          <Form.Label>{this.props.name}</Form.Label>
          <Tabs activeKey={this.state.activeTab}
                transition={false}
                id="dataTabs"
                onSelect={this.handleTabChange}
          >
            <Tab eventKey="byText" title="by Input">
            <ByText name={this.props.byTextName}
                    textAreaValue={this.props.textAreaValue}
                    placeholder={this.props.byTextPlaceholder}
                    handleByTextChange={this.props.handleByTextChange}
            />
           </Tab>
           <Tab eventKey="byURL" title="By URL">
             <ByURL name={this.props.byURLName}
                    urlValue={this.props.urlValue}
                    handleUrlChange={this.props.handleUrlChange}
                    placeholder={this.props.byUrlPlaceholder}
             />
           </Tab>
           <Tab eventKey="byFile" title="By File">
             <ByFile name={this.props.byFileName}
                     handleFileUpload={this.props.handleFileUpload}
             />
            </Tab>
         </Tabs>
         </Form.Group>
        );
    }
}

export default InputTabs;
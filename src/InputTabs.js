import React from 'react';
import Form from 'react-bootstrap/Form';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import ByURL from './ByURL';
import ByFile from './ByFile';
import ByText from './ByText';
import PropTypes from "prop-types";

class InputTabs extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            activeTab: this.props.activeTab
        }
        this.handleTabChange = this.handleTabChange.bind(this);
    }

    handleTabChange(e) {
        console.log(`Event: ${JSON.stringify(e)}`)
        this.setState({ activeTab: e})
        this.props.handleTabChange(e);
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

InputTabs.propTypes = {
    name: PropTypes.string.isRequired,
    activeTab: PropTypes.string,
    handleTabChange: PropTypes.func.isRequired,
    byTextName: PropTypes.string,
    textAreaValue: PropTypes.string,
    handleByTextChange: PropTypes.func.isRequired,
    byTextPlaceholder: PropTypes.string,
    byUrlName: PropTypes.string.isRequired,
    urlValue: PropTypes.string.isRequired,
    handleUrlChange: PropTypes.func.isRequired,
    byUrlPlaceholder: PropTypes.string,
    byFileName: PropTypes.string,
    handleFileUpload: PropTypes.func.isRequired,
};

InputTabs.defaultProps = {
    activeTab: 'ByText',
    byTextName: '',
    byTextPlaceholder: '',
    byUrlName: '',
    byUrlPlaceholder: '',
    byFileName: ''
};

export default InputTabs;
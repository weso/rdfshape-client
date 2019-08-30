import React from 'react';
import Form from 'react-bootstrap/Form';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import ByURL from './ByURL';
import ByFile from './ByFile';
import ByText from './ByText';
import PropTypes from "prop-types";
import API from './API'

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
                    <Tab eventKey={API.byTextTab} title="by Input">
                        <ByText name={this.props.byTextName}
                                textAreaValue={this.props.textAreaValue}
                                placeholder={this.props.byTextPlaceholder}
                                handleByTextChange={this.props.handleByTextChange}
                                inputForm = {this.props.inputForm}
                        />
                    </Tab>
                    <Tab eventKey={API.byUrlTab} title="By URL">
                        <ByURL name={this.props.byURLName}
                               urlValue={this.props.urlValue}
                               handleUrlChange={this.props.handleUrlChange}
                               placeholder={this.props.byURLPlaceholder}
                        />
                    </Tab>
                    <Tab eventKey={API.byFileTab} title="By File">
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
    byURLPlaceholder: PropTypes.string,
    byFileName: PropTypes.string,
    handleFileUpload: PropTypes.func.isRequired,
};

InputTabs.defaultProps = {
    activeTab: API.defaultTab,
    byTextName: '',
    byTextPlaceholder: '',
    byUrlName: '',
    byURLPlaceholder: 'http://...',
    byFileName: ''
};

export default InputTabs;

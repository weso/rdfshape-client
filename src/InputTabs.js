import React, {useState} from 'react';
import Form from 'react-bootstrap/Form';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import ByURL from './ByURL';
import ByFile from './ByFile';
import ByText from './ByText';
import PropTypes from "prop-types";
import API from './API'

function InputTabs(props) {
    const [activeTab, setActiveTab] = useState(props.activeTab)

    function handleTabChange(e) {
        console.log(`InputTabs: handleTabChange(${JSON.stringify(e)})`)
        console.log(`InputTabs: props.handleTabChange = (${typeof props.handleTabChange})`)
        setActiveTab(e)
        props.handleTabChange(e);
    }

    return (
        <Form.Group>
            <p>HandleTabChange in InputTabs: {typeof props.handleTabChange}</p>
            <Form.Label>{props.name}</Form.Label>
            <Tabs activeKey={activeTab}
                  transition={false}
                  id="dataTabs"
                  onSelect={handleTabChange}
            >
                <Tab eventKey={API.byTextTab} title="by Input">
                    <ByText name={props.byTextName}
                            textAreaValue={props.textAreaValue}
                            placeholder={props.byTextPlaceholder}
                            handleByTextChange={props.handleByTextChange}
                            inputForm = {props.inputForm}
                    />
                </Tab>
                <Tab eventKey={API.byUrlTab} title="By URL">
                    <ByURL name={props.byURLName}
                           urlValue={props.urlValue}
                           handleUrlChange={props.handleUrlChange}
                           placeholder={props.byURLPlaceholder}
                    />
                </Tab>
                <Tab eventKey={API.byFileTab} title="By File">
                    <ByFile name={props.byFileName}
                            handleFileUpload={props.handleFileUpload}
                    />
                </Tab>
            </Tabs>
        </Form.Group>
    );
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

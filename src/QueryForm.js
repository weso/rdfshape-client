import React, {useState, useEffect} from 'react';
import 'yasgui-yasqe/dist/yasqe.min.css'
import Yasqe from 'yasgui-yasqe/dist/yasqe.bundled.min';
import PropTypes from "prop-types";

function QueryForm(props) {
    const [yasqe,setYasqe] = useState(null)

    useEffect(() => {
        if (!yasqe) {
            const y = Yasqe.fromTextArea(document.getElementById(props.id), {
                sparql: {
                    showQueryButton: false
                },
                createShareLink: null
            })
            y.on('change', (cm,change) => {
                // setQuery(cm.getValue())
                props.onChange(cm.getValue())
            });
            y.setValue(props.value)
            setYasqe(y);
        }});
    return (
        <textarea id={props.id}/>
    );
}

QueryForm.propTypes = {
    id: PropTypes.string.isRequired,
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired
}

QueryForm.defaultProps = {
    value: ''
}

export default QueryForm;

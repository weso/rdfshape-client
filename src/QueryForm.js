import React, { useEffect, useState } from 'react';
import PropTypes from "prop-types";
import Yasqe from 'yasgui-yasqe/dist/yasqe.bundled.min';
import 'yasgui-yasqe/dist/yasqe.min.css';
import 'codemirror/addon/display/placeholder';

function QueryForm(props) {
    const [yasqe,setYasqe] = useState(null);

    useEffect(() => {
        if (!yasqe) {
            const y = Yasqe.fromTextArea(document.getElementById(props.id), {
                sparql: {
                    showQueryButton: false
                },
                createShareLink: null,
                placeholder: props.placeholder
            });
            y.on('change', (cm,change) => {
                // setQuery(cm.getValue())
                props.onChange(cm.getValue())
            });
            y.setValue(props.value);
            y.refresh();
            setYasqe(y);
        }
    }, [yasqe, props]);

    return (
        <textarea id={props.id}/>
    );
}

QueryForm.propTypes = {
    id: PropTypes.string.isRequired,
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    placeholder: PropTypes.string
};

QueryForm.defaultProps = {
    value: ''
};

export default QueryForm;

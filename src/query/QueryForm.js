import React, { useEffect, useState, useRef } from 'react';
import PropTypes from "prop-types";
import Yasqe from 'yasgui-yasqe/dist/yasqe.bundled.min';
import 'yasgui-yasqe/dist/yasqe.min.css';
import 'codemirror/addon/display/placeholder';

function QueryForm(props) {
    const [yasqe,setYasqe] = useState(null);
    const textAreaRef = useRef(null);

    useEffect(() => {
        if (!yasqe) {
            const options = {
                sparql: {
                    showQueryButton: false
                },
                createShareLink: null,
                placeholder: props.placeholder,
                readonly: props.readonly
            };
            const y = Yasqe.fromTextArea(textAreaRef.current, options);
            if (props.setCodeMirror) props.setCodeMirror(y);
            y.on('change', (cm,change) => {
                // setQuery(cm.getValue())
                props.onChange(cm.getValue(),y)
            });
            y.setValue(props.value);
            y.refresh();
            setYasqe(y);
        } else if (props.fromParams) {
            yasqe.setValue(props.value);
            props.resetFromParams();
        }
    }, [yasqe,
        props.onChange,
        props.placeholder,
        props.fromParams,
        props.resetFromParams,
        props.value
    ]);

    return (
        <textarea ref={textAreaRef}/>
    );
}

QueryForm.propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
    readonly: PropTypes.bool,
    fromParams: PropTypes.bool,
    resetFromParams: PropTypes.func
};

QueryForm.defaultProps = {
    value: '',
    readonly: false
};

export default QueryForm;

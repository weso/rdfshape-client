import React, {useState, useEffect, useRef} from 'react';
import 'yashe/dist/yashe.min.css'
import Yashe from 'yashe/dist/yashe.bundled.min';
import PropTypes from "prop-types";

function ShExForm(props) {
    const [yashe,setYashe] = useState(null);
    const textAreaRef=useRef(null);

    useEffect(() => {
        if (!yashe) {
            const options = {
                placeholder: props.placeholder,
                readonly: props.readonly
            };
            const y = Yashe.fromTextArea(
                textAreaRef.current, 
                options);
            if (props.setCodeMirror) props.setCodeMirror(y);
            y.on('change', (cm,change) => {
                // setQuery(cm.getValue())
                props.onChange(cm.getValue(), y);
                // y.refresh();
            });
            y.setValue(props.value);
            y.refresh();
            setYashe(y);
        } else if (props.fromParams) {
            yashe.setValue(props.value);
            props.resetFromParams();
        }
    }, [yashe,
        props.onChange,
        props.placeholder,
        props.fromParams,
        props.resetFromParams,
        props.setCodeMirror,
        props.value]
    );

    return (
        <textarea ref={textAreaRef}/>
    );
}

ShExForm.propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func,
    placeholder: PropTypes.string,
    readonly: PropTypes.bool,
    fromParams: PropTypes.bool,
    resetFromParams: PropTypes.func,
};

ShExForm.defaultProps = {
    value: '',
    readonly: false
}

export default ShExForm;

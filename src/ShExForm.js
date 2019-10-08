import React, {useState, useEffect, useRef} from 'react';
import 'yashe/dist/yashe.min.css'
import Yashe from 'yashe/dist/yashe.bundled.min';
import PropTypes from "prop-types";

function ShExForm(props) {
    const [yashe,setYashe] = useState(null)
    const textAreaRef=useRef(null)

    useEffect(() => {
        if (!yashe) {
//            const y = Yashe.fromTextArea(document.getElementById(props.id))
            const options = { 
                placeholder: props.placeholder 
            }
            const y = Yashe.fromTextArea(
                textAreaRef.current, 
                options)
            y.on('change', (cm,change) => {
                // setQuery(cm.getValue())
                props.onChange(cm.getValue())
            });
            y.setValue(props.value)
            y.refresh();
            setYashe(y);
        }
    }, [yashe,
        props.onChange,
        props.placeholder,
        props.value]
    );

    return (
        <textarea ref={textAreaRef}/>
    );
}

ShExForm.propTypes = {
//    id: PropTypes.string.isRequired,
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    placeholder: PropTypes.string
}

ShExForm.defaultProps = {
    value: ''
}

export default ShExForm;

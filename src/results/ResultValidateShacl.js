import React, { Fragment } from 'react';
import Alert from "react-bootstrap/Alert";
import Code from "../components/Code";
import { Permalink } from "../Permalink";
import ShowShapeMap from "../shapeMap/ShowShapeMap";
import PrintJson from "../utils/PrintJson";

function ResultValidateShacl(props) {

    const result = props.result
    let msg
    if (result === "") {
        msg = null
    } else
    if (result.error) {
        msg =
            <div><Alert variant="danger">Error: {result.error}</Alert></div>
    } else {
        msg = <div>
            {
                !Array.isArray(result.shapeMap) ? <Alert variant="danger">{result.message}</Alert>
                    :
                <Fragment>
                    { result.errors.length > 0 ?
                        <Alert variant="danger">Invalid data</Alert> :
                        result.message && <Alert variant="success">{result.message} </Alert>
                    }
{/*
                    {result.shapeMap.length === 0 && <Alert variant="info">
                        Validation OK </Alert>}
*/}
                    { props.permalink &&
                    <Fragment>
                        <Code mode='turtle' value={result.validationReport} readonly={true} />
                        <Permalink url={props.permalink} disabled={props.disabled}/>
                        <hr/>
                    </Fragment>
                    }
                    { result.shapeMap && result.shapeMap.length > 0 && <ShowShapeMap
                        shapeMap={result.shapeMap}
                        nodesPrefixMap={result.nodesPrefixMap}
                        shapesPrefixMap={result.shapesPrefixMap}
                    />
                    }
                </Fragment>

            }
            <details><PrintJson json={result} /></details>
        </div>
    }

     return (
         <div>{msg}</div>
     );
}

export default ResultValidateShacl

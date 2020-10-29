import React, { Fragment } from 'react';
import Alert from 'react-bootstrap/Alert';
import Code from '../components/Code';
import { Permalink } from "../Permalink";
import PrintJson from "../utils/PrintJson";
import { mkMode } from "../utils/Utils";

function ResultDataInfo(props) {
    const result = props.result;
    console.info("RESULT: ", result)
    let msg = null;
    if (result) {
        const mode = mkMode(result.dataFormat);
        if (result.error) {
            msg = <Alert variant='danger'>{result.error}</Alert>
        }
        else if (result.msg && result.msg.toLowerCase().startsWith("error")){
                msg = <Alert variant='danger'>{result.msg}</Alert>
        } else {
            msg = <div>
                <Alert variant='success'>{result.msg}</Alert>
                {result.data && result.dataFormat && (
                    <Code
                        value={result.data}
                        mode={mode}
                        readOnly={true}
                        onChange={() => {}}
                        fromParams={props.fromParams}
                        resetFromParams={props.resetFromParams}
                    />
                )}
                <br/>
                <ul>
                    <li>Number of statements: {result.numberStatements}</li>
                    <li>DataFormat: <span>{result.dataFormat}</span></li>
                </ul>
                <details>
                    <PrintJson json={result} />
                </details>
                { props.permalink &&
                <Fragment>
                    <hr/>
                    <Permalink url={props.permalink} disabled={props.disabled}/>
                </Fragment>
                }
            </div>
        }
        return (
            <div>
                {msg}
            </div>
        );
    }
}


export default ResultDataInfo;

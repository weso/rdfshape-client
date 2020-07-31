import React, {Fragment} from 'react';
import Code from '../components/Code';
import { mkMode } from "../utils/Utils";
import Alert from 'react-bootstrap/Alert';
import {Permalink} from "../Permalink";
import PrintJson from "../utils/PrintJson";

function ResultDataInfo(props) {
    const result = props.result;
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
                    <Permalink url={props.permalink}/>
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

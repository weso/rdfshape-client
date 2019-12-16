import React from 'react';
import Code from '../components/Code';
import { mkMode } from "../utils/Utils";
import Alert from 'react-bootstrap/Alert';

function ResultDataInfo(props) {
    const result = props.result;
    let msg = null;
    if (result) {
        const mode = mkMode(result.dataFormat);
        console.log(`Mode: ${mode}`);
        if (result.error) {
            msg = <Alert variant='danger'>{result.error}</Alert>
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
                <ul>
                    <li>Number of statements: {result.numberStatements}</li>
                    <li>DataFormat: <span>{result.dataFormat}</span></li>
                </ul>
                <details>
                    <pre>{JSON.stringify(result)}</pre>
                </details>
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

import React, {Fragment} from 'react';
import Code from '../components/Code';
import { mkMode } from "../utils/Utils";
import Alert from 'react-bootstrap/Alert';
import {Permalink} from "../Permalink";

function ResultShapeMapInfo(props) {
    const result = props.result
    let msg = null;
    if (result) {
        const mode = mkMode(result.shapeMapFormat)
        console.log(`Mode: ${mode}`)
        if (result.error) {
            msg = <Alert variant='danger'>{result.error}</Alert>
        } else {
            msg = <div>
                <Alert variant='success'>{result.msg}</Alert>
                {result.shapeMap && result.shapeMapFormat && (
                    <Code
                        value={result.shapeMap}
                        mode={mode}
                        readOnly={true}
                        onChange={() => {}}
                        fromParams={props.fromParams}
                        resetFromParams={props.resetFromParams}
                    />
                )}
                { props.permalink &&
                    <Fragment>
                        <hr/>
                        <Permalink url={props.permalink}/>
                    </Fragment>
                }
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


export default ResultShapeMapInfo;

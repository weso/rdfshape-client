import React, { Fragment } from 'react';
import Alert from 'react-bootstrap/Alert';
import Code from '../components/Code';
import { Permalink } from "../Permalink";
import { mkMode } from "../utils/Utils";

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
                        <Permalink url={props.permalink} disabled={props.disabled}/>
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
    else return (
        <div>
            <Alert variant='danger'>ShapeMap by URL/File not implemented</Alert>
        </div>
    );
}


export default ResultShapeMapInfo;

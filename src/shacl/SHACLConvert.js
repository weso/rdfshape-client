import React, { useState } from 'react';
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Container from 'react-bootstrap/Container';
import Form from "react-bootstrap/Form";
import ProgressBar from "react-bootstrap/ProgressBar";
import Row from "react-bootstrap/Row";
import { InitialShacl, mkShaclTabs } from "./SHACL";


function SHACLConvert() {

    const [shacl, setShacl] = useState(InitialShacl)
    const [result, setResult] = useState('')
    const [error, setError] = useState('')
    const [loading,setLoading] = useState(false)
    const [permalink, setPermalink] = useState(null)
    const [progressPercent,setProgressPercent] = useState(0)

    function handleSubmit(event) {
        event.preventDefault()
        window.scrollTo(0, 0)
    }

     return (
       <Container>
         <h1>Convert between SHACL formats</h1>
           <Alert className="width-100" variant='danger'>Not implemented yet</Alert>
           <Form onSubmit={handleSubmit}>
               { mkShaclTabs(shacl,setShacl, "Shapes graph (SHACL)")}
               <hr/>
              <Button variant="primary" type="submit"
                      className={"btn-with-icon " + (loading ? "disabled" : "")} disabled={loading}>
                  Validate
              </Button>
           </Form>
           {loading || result || error || permalink ?
               <Row style={{margin: '10px auto 10% auto'}}>
                   {loading ? <ProgressBar className="width-100" striped animated variant="info" now={progressPercent}/> :
                       error ? <Alert className="width-100" variant='danger'>{error}</Alert> :
                           result ? /*<Result/> */ null
                               :
                               null
                   }
               </Row> : null
           }
       </Container>
     );
}

export default SHACLConvert;

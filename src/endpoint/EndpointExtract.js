import React, {useState} from 'react';
import Container from 'react-bootstrap/Container';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import EndpointInput from "./EndpointInput";
import Row from "react-bootstrap/Row";
import ProgressBar from "react-bootstrap/ProgressBar";
import Alert from "react-bootstrap/Alert";

function EndpointExtract() {

    const [endpoint, setEndpoint] = useState('')
    const [result, setResult] = useState('')
    const [error, setError] = useState('')
    const [loading,setLoading] = useState(false)
    const [permalink, setPermalink] = useState(null)
    const [progressPercent,setProgressPercent] = useState(0)

    function handleOnChange(value) {
        setEndpoint(value)
    }

    function handleOnSelect(event) {
        setLoading(false)
    }

    function handleSubmit(event) {
        event.preventDefault()
        console.log("Not implemented")
        window.scrollTo(0, 0)
    }

     return (
       <Container fluid={true}>
         <h1>Extract schema from Endpoint node</h1>
           <Alert variant='danger'>Not implemented yet</Alert>
           <Form id="common-endpoints" onSubmit={handleSubmit}>
               <EndpointInput value={endpoint}
                              handleOnChange={handleOnChange}
                              handleOnSelect={handleOnSelect}
               />
               <hr/>
               <Button variant="primary" type="submit"
                       className={"btn-with-icon " + (loading ? "disabled" : "")} disabled={loading}>
                   Extract schema</Button>
           </Form>
           {loading || result || error || permalink ?
               <Row style={{margin: '10px auto 10% auto'}}>
                   {loading ? <ProgressBar className="width-100" striped animated variant="info" now={progressPercent}/> :
                       error ? <Alert className="width-100" variant='danger'>{error}</Alert> :
                           result ? null /*<Result/> */
                               :
                               null
                   }
               </Row> : null
           }

       </Container>
     );
}

export default EndpointExtract;

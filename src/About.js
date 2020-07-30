import React, {useEffect, useState} from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import Container from 'react-bootstrap/Container';
import API from "./API";
import axios from "axios";

function About()  {
    const [status,setStatus] =useState({msg: `Asking info to server`});

    useEffect(() => {
        const url = API.healthServer;
        setStatus({msg : `Requesting server status to ${API.healthServer}`});
        axios.get(url).then(response => response.data)
            .then((data) => {
                setStatus({ msg: data })
            }).catch((error) => {
            setStatus({
                msg : `Server error: ${error}. Server address: ${API.healthServer}`,
                error: error
            })
        })
    }, []);

    return (
       <Container>
         <h1>About RDFShape</h1>
           <p>RDFShape offers an RDF playground which can be used to teach RDF related technologies</p>
           <p>Paper describing RDFShape: <a href="http://ceur-ws.org/Vol-2180/paper-35.pdf">RDFShape: An RDF playground based on Shapes</a>,
               {' '}
               <a href="http://labra.weso.es">Jose Emilio Labra Gayo</a>, Daniel Fernández Álvarez, Herminio García González,
               {' '}
               Demo presented at <a href="http://iswc2018.semanticweb.org/">International Semantic Web Conference</a>, Monterey, California - 2018
            </p>
            <ul>
            <li>RDFShape Version {process.env.REACT_APP_VERSION} [{process.env.NODE_ENV}]</li>
                   <li>Server host: {process.env.REACT_APP_RDFSHAPE_HOST}</li>
                   {/*                   <li>Built with <a href="http://www.scala-lang.org/">Scala</a> and <a href="http://www.scala-sbt.org/">SBT</a></li> */}
                   <li>Source code:
                       <ul>
                           <li><a href="https://github.com/labra/rdfshape-client">Client</a></li>
                           <li><a href="https://github.com/labra/rdfshape">Server</a></li>
                           <li><a href="https://github.com/labra/shaclex">validation libraries</a></li>
                       </ul>
                   </li>
                   <li><a href="https://github.com/labra/shaclex/issues/4">SHEX Features</a></li>
                   <li><a href="https://github.com/labra/shaclex/issues/2">SHACL Features</a></li>
                   <li>Info about the languages: <a href="http://book.validatingrdf.com">Validating RDF data book</a></li>
               </ul>
           <details>
               <p>Server: <code>{API.rootApi}</code></p>
               <p>Server status: <code>{status.msg}</code>
                   { status.error? <details><pre>{JSON.stringify(status.error)}</pre></details>: null}
               </p>
           </details>
           <h2>Authors & contributors</h2>
           <ul>
               <li><a href="http://labra.weso.es">Jose Emilio Labra Gayo</a> (<a href="http://www.weso.es">WESO research group</a>)</li>
               <li><a href="https://github.com/ulitol97">Eduardo Ulibarri Toledo</a> (<a href="http://www.weso.es">WESO research group</a>)</li>
               <li><a href="https://github.com/mistermboy">Pablo Menéndez Suárez</a> (<a href="http://www.weso.es">WESO research group</a>)</li>
           </ul>

       </Container>
     );
}

export default About;

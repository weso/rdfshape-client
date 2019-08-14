import React from 'react';
import './App.css';
// import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Route } from "react-router-dom";
import RDFShapeNavbar from "./RDFShapeNavbar";
import Container from 'react-bootstrap/Container';
import About from './About.js';
import DataInfo from './DataInfo.js';
import DataConversions from './DataConversions.js';

function App() {

  return (
      <Router>
      <Container>
          <h1>RDFShape</h1>
          <RDFShapeNavbar />
      </Container>
      <Route path="/about" component={About} />
      <Route path="/dataConversions" component={DataConversions} />
      <Route path="/dataInfo" component={DataInfo} />
      </Router>
  );
}

export default App;

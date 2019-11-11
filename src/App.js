import React from 'react';
import './App.css';
import RDFShapeNavbar from "./RDFShapeNavbar";
import Container from 'react-bootstrap/Container';
import Routes from './Routes.js';
import Cyto from './components/Cyto.js';

function App() {

  return (
      <Container fluid={true}>
        <RDFShapeNavbar />
        <Routes />
      </Container>
  );
}

export default App;

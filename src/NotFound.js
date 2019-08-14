import React from 'react';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

function NotFound() {
 return (
     <Jumbotron>
         <h1>Not found</h1>
             <Button variant="primary" href="/">Go Home</Button>
     </Jumbotron>
 )
}

export default NotFound;

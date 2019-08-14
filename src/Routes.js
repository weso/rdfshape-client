import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import NotFound from './NotFound.js';
import About from './About.js';
import Home from './Home.js';

import DataInfo from './DataInfo.js';
import DataConvert from './DataConvert.js';
import DataVisualize from './DataVisualize.js';
import DataQuery from './DataQuery.js';
import DataExtract from './DataExtract.js';

import EndpointInfo from './EndpointInfo.js';
import EndpointQuery from './EndpointQuery.js';
import EndpointExtract from './EndpointExtract.js';

import ShExInfo from './ShExInfo.js';
import ShExValidate from './ShExValidate.js';
import ShExConvert from './ShExConvert.js';
import ShExVisualize from './ShExVisualize.js';
import ShEx2SHACL from './ShEx2SHACL.js';

import SHACLInfo from './SHACLInfo.js';
import SHACLValidate from './SHACLValidate.js';
import SHACLConvert from './SHACLConvert.js';
import SHACL2ShEx from './SHACL2ShEx.js';

import WikidataValidate from './WikidataValidate.js';
import WikidataQuery from './WikidataQuery.js';
import WikidataExtract from './WikidataExtract.js';

function Routes() {

  return (
      <Router>
      <Switch>
      <Route path="/" exact component={Home} />
      <Route path="/dataInfo" component={DataInfo} />
      <Route path="/dataConvert" component={DataConvert} />
      <Route path="/dataVisualize" component={DataVisualize} />
      <Route path="/dataQuery" component={DataQuery} />
      <Route path="/dataExtract" component={DataExtract} />

      <Route path="/endpointInfo" component={EndpointInfo} />
      <Route path="/endpointQuery" component={EndpointQuery} />
      <Route path="/endpointExtract" component={EndpointExtract} />

      <Route path="/shexValidate" component={ShExValidate} />
      <Route path="/shexInfo" component={ShExInfo} />
      <Route path="/shexVisualize" component={ShExVisualize} />
      <Route path="/shexConvert" component={ShExConvert} />
      <Route path="/shex2shacl" component={ShEx2SHACL} />

      <Route path="/shaclInfo" component={SHACLInfo} />
      <Route path="/shaclValidate" component={SHACLValidate} />
      <Route path="/shaclConvert" component={SHACLConvert} />
      <Route path="/shacl2shex" component={SHACL2ShEx} />

      <Route path="/wikidataQuery" component={WikidataQuery} />
      <Route path="/wikidataValidate" component={WikidataValidate} />
      <Route path="/wikidataExtract" component={WikidataExtract} />
      <Route path="/about" component={About} />
      <Route component={NotFound} />
      </Switch>
     </Router>
  );
}

export default Routes;

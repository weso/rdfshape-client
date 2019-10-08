import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import NotFound from './NotFound.js';
import About from './About.js';
import Home from './Home.js';

import DataInfo from './DataInfo.js';
import DataConvert from './DataConvert.js';
import DataVisualize from './DataVisualize.js';
import CytoVisualize from './CytoVisualize.js';
import DataQuery from './DataQuery.js';
import DataExtract from './DataExtract.js';

import EndpointInfo from './EndpointInfo.js';
import EndpointQuery from './EndpointQuery.js';
import EndpointExtract from './EndpointExtract.js';

import ShExInfo from './ShExInfo.js';
import ShExValidate from './ShExValidate.js';
import ShExValidateEndpoint from './ShExValidateEndpoint.js';
import ShExConvert from './ShExConvert.js';
import ShExVisualize from './ShExVisualize.js';
import ShExVisualizeCytoscape from './ShExVisualizeCytoscape.js';
import ShEx2Shacl from './ShEx2Shacl.js';

import SHACLInfo from './SHACLInfo.js';
import SHACLValidate from './SHACLValidate.js';
import SHACLConvert from './SHACLConvert.js';
import SHACL2ShEx from './SHACL2ShEx.js';

import WikidataValidate from './WikidataValidate.js';
import WikidataQuery from './WikidataQuery.js';
import WikidataExtract from './WikidataExtract.js';
import API from './API.js';

// Only for testing
import TestYashe from './test/TestYashe.js'
import TestYasqe from './test/TestYasqe.js'
import TestRDFArea from './test/TestRDFArea.js'
import TestCyto from './test/TestCyto.js'
import TestCode from './test/TestCode.js'
import TestYate from './test/TestYate.js'

function Routes() {

  return (
      <Router>
      <Switch>
      <Route path="/" exact component={Home} />
      <Route path={API.dataInfoRoute} component={DataInfo} />
      <Route path={API.dataConvertRoute} component={DataConvert} />
      <Route path={API.dataVisualizeRoute} component={DataVisualize} />
      <Route path={API.cytoVisualizeRoute} component={CytoVisualize} />
      <Route path={API.dataQueryRoute} component={DataQuery} />
      <Route path={API.dataExtractRoute} component={DataExtract} />

      <Route path={API.endpointInfoRoute} component={EndpointInfo} />
      <Route path={API.endpointQueryRoute} component={EndpointQuery} />
      <Route path={API.endpointExtractRoute} component={EndpointExtract} />

      <Route path={API.shExValidateRoute} component={ShExValidate} />
      <Route path={API.shExValidateEndpointRoute} component={ShExValidateEndpoint} />
      <Route path={API.shExInfoRoute} component={ShExInfo} />
      <Route path={API.shExVisualizeRoute} component={ShExVisualize} />
      <Route path={API.shExVisualizeCytoscapeRoute} component={ShExVisualizeCytoscape} />
      <Route path={API.shExConvertRoute} component={ShExConvert} />
      <Route path={API.shEx2ShaclRoute} component={ShEx2Shacl} />

      <Route path={API.shaclInfoRoute} component={SHACLInfo} />
      <Route path={API.shaclValidateRoute} component={SHACLValidate} />
      <Route path={API.shaclConvertRoute} component={SHACLConvert} />
      <Route path={API.shacl2ShExRoute} component={SHACL2ShEx} />

      <Route path={API.wikidataQueryRoute} component={WikidataQuery} />
      <Route path={API.wikidataValidateRoute} component={WikidataValidate} />
      <Route path={API.wikidataExtractRoute} component={WikidataExtract} />
      <Route path={API.aboutRoute} component={About} />
      <Route path="/test/yashe" component={TestYashe} />
      <Route path="/test/yasqe" component={TestYasqe} />
      <Route path="/test/rdfArea" component={TestRDFArea} />
      <Route path="/test/cyto" component={TestCyto} />
      <Route path="/test/code" component={TestCode} />
      <Route path="/test/turtle" component={TestYate} />

      <Route component={NotFound} />
      </Switch>
     </Router>
  );
}

export default Routes;

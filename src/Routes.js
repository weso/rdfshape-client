import React from 'react';
import './App.css';
import { BrowserRouter as Router, Redirect, Route, Switch } from "react-router-dom";
import NotFound from './NotFound.js';
import About from './About.js';
import Home from './Home.js';

import DataInfo from './data/DataInfo.js';
import DataConvert from './data/DataConvert.js';
import DataVisualize from './data/DataVisualize.js';
import CytoVisualize from './cytoscape/CytoVisualize.js';
import DataQuery from './data/DataQuery.js';
import DataExtract from './data/DataExtract.js';

import EndpointInfo from './endpoint/EndpointInfo.js';
import EndpointQuery from './endpoint/EndpointQuery.js';
import EndpointExtract from './endpoint/EndpointExtract.js';

import ShExInfo from './shex/ShExInfo.js';
import ShExValidate from './shex/ShExValidate.js';
import ShExValidateEndpoint from './shex/ShExValidateEndpoint.js';
import ShExConvert from './shex/ShExConvert.js';
import ShExVisualize from './shex/ShExVisualize.js';
import ShExVisualizeCytoscape from './shex/ShExVisualizeCytoscape.js';
import ShEx2Shacl from './shex/ShEx2Shacl.js';

import SHACLInfo from './shacl/SHACLInfo.js';
import SHACLValidate from './shacl/SHACLValidate.js';
import SHACLConvert from './shacl/SHACLConvert.js';
import SHACL2ShEx from './shacl/SHACL2ShEx.js';

import ShapeMapInfo from "./shapeMap/ShapeMapInfo";

import WikidataValidate from './wikidata/WikidataValidate.js';
import WikidataQuery from './wikidata/WikidataQuery.js';
import WikidataExtract from './wikidata/WikidataExtract.js';
import API from './API.js';

// Only for testing
import TestYashe from './test/TestYashe.js'
import TestYasqe from './test/TestYasqe.js'
import TestRDFArea from './test/TestRDFArea.js'
import TestCyto from './test/TestCyto.js'
import TestCode from './test/TestCode.js'
import TestYate from './test/TestYate.js'
import TestSearch from './test/TestSearch.js'
import TestGithubSearch from './test/TestGithubSearch.js'
import TestInputTabsWithFormat from "./test/TestInputTabsWithFormat";
import DataMerge from "./data/DataMerge";
import DataMergeVisualize from "./data/DataMergeVisualize";

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
      <Route path={API.dataMerge} component={DataMerge} />
      <Route path={API.dataMergeVisualize} component={DataMergeVisualize} />

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

      <Route path={API.shapeMapInfoRoute} component={ShapeMapInfo} />

      <Route path={API.wikidataQueryRoute} component={WikidataQuery} />
      <Route path={API.wikidataValidateRoute} component={WikidataValidate} />
      <Route path={API.wikidataExtractRoute} component={WikidataExtract} />
      <Route path={API.aboutRoute} component={About} />

      {/*The following route is for backwards compatibility*/}
      <Route path="/validate" component={ShExValidate} />


      <Route path="/test/yashe" component={TestYashe} />
      <Route path="/test/yasqe" component={TestYasqe} />
      <Route path="/test/rdfArea" component={TestRDFArea} />
      <Route path="/test/cyto" component={TestCyto} />
      <Route path="/test/code" component={TestCode} />
      <Route path="/test/turtle" component={TestYate} />
      <Route path="/test/search" component={TestSearch} />
      <Route path="/test/github" component={TestGithubSearch} />
      <Route path="/test/inputTabsWithFormat" component={TestInputTabsWithFormat} />


      <Route path="/links/i1" render={()=><Redirect to="/dataInfo?data=%40prefix%20%3A%20%20%20%20%20%20%3Chttp%3A%2F%2Fexample.org%2F%3E%20.%0A%40prefix%20schema%3A%20%3Chttp%3A%2F%2Fschema.org%2F%3E%20.%0A%40prefix%20item%3A%20%20%3Chttp%3A%2F%2Fdata.europeana.eu%2Fitem%2F04802%2F%3E%20.%0A%40prefix%20dbr%3A%20%20%20%3Chttp%3A%2F%2Fdbpedia.org%2Fresource%2F%3E%20.%0A%40prefix%20xsd%3A%20%20%20%3Chttp%3A%2F%2Fwww.w3.org%2F2001%2FXMLSchema%23%3E%20.%0A%40prefix%20dcterms%3A%20%3Chttp%3A%2F%2Fpurl.org%2Fdc%2Fterms%2F%3E%20.%0A%40prefix%20it%3A%20%20%20%20%3Chttp%3A%2F%2Fdata.example.org%2Fitem%2F%3E%20.%0A%40prefix%20wd%3A%20%20%20%20%3Chttp%3A%2F%2Fwww.wikidata.org%2Fentity%2F%3E%20.%0A%40prefix%20foaf%3A%20%20%3Chttp%3A%2F%2Fxmlns.com%2Ffoaf%2F0.1%2F%3E%20.%0A%0A%3Aalice%20%20a%20%20%20%20%20%20%20foaf%3APerson%20.%0A%0A%3Abob%20%20%20%20a%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20foaf%3APerson%20%3B%0A%20%20%20%20%20%20%20%20schema%3AbirthDate%20%20%20%20%20%221990-07-04%22%5E%5Exsd%3Adate%20%3B%0A%20%20%20%20%20%20%20%20foaf%3Aknows%20%20%20%20%20%20%20%20%20%20%20%3Chttp%3A%2F%2Fexample.org%2Falice%23me%3E%20%3B%0A%20%20%20%20%20%20%20%20foaf%3Atopic_interest%20%20wd%3AQ12418%20.%0A%0A%3Acarol%20%20a%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20foaf%3APerson%20%3B%0A%20%20%20%20%20%20%20%20schema%3AbirthDate%20%20%22unknown%22%20.%0A%0Awd%3AQ12418%20%20dcterms%3Acreator%20%20dbr%3ALeonardo_da_Vinci%20%3B%0A%20%20%20%20%20%20%20%20dcterms%3Atitle%20%20%20%20%22Mona%20Lisa%22%20.%0A%0Ait%3A243FA%20%20dcterms%3Asubject%20%20wd%3AQ12418%20%3B%0A%20%20%20%20%20%20%20%20dcterms%3Atitle%20%20%20%20%22La%20Joconde%20%C3%A0%20Washington%22%40fr%20.%0A&dataFormat=TURTLE&inference=NONE"/>} />
      <Route path="/links/i2" render={()=><Redirect to='/dataConvert?data=%40prefix%20%3A%20%20%20%20%20%20%3Chttp%3A%2F%2Fexample.org%2F%3E%20.%0A%40prefix%20schema%3A%20%3Chttp%3A%2F%2Fschema.org%2F%3E%20.%0A%40prefix%20item%3A%20%20%3Chttp%3A%2F%2Fdata.europeana.eu%2Fitem%2F04802%2F%3E%20.%0A%40prefix%20dbr%3A%20%20%20%3Chttp%3A%2F%2Fdbpedia.org%2Fresource%2F%3E%20.%0A%40prefix%20xsd%3A%20%20%20%3Chttp%3A%2F%2Fwww.w3.org%2F2001%2FXMLSchema%23%3E%20.%0A%40prefix%20dcterms%3A%20%3Chttp%3A%2F%2Fpurl.org%2Fdc%2Fterms%2F%3E%20.%0A%40prefix%20it%3A%20%20%20%20%3Chttp%3A%2F%2Fdata.example.org%2Fitem%2F%3E%20.%0A%40prefix%20wd%3A%20%20%20%20%3Chttp%3A%2F%2Fwww.wikidata.org%2Fentity%2F%3E%20.%0A%40prefix%20foaf%3A%20%20%3Chttp%3A%2F%2Fxmlns.com%2Ffoaf%2F0.1%2F%3E%20.%0A%0A%3Aalice%20%20a%20%20%20%20%20%20%20foaf%3APerson%20.%0A%0A%3Abob%20%20%20%20a%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20foaf%3APerson%20%3B%0A%20%20%20%20%20%20%20%20schema%3AbirthDate%20%20%20%20%20%221990-07-04%22%5E%5Exsd%3Adate%20%3B%0A%20%20%20%20%20%20%20%20foaf%3Aknows%20%20%20%20%20%20%20%20%20%20%20%3Chttp%3A%2F%2Fexample.org%2Falice%23me%3E%20%3B%0A%20%20%20%20%20%20%20%20foaf%3Atopic_interest%20%20wd%3AQ12418%20.%0A%0A%3Acarol%20%20a%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20foaf%3APerson%20%3B%0A%20%20%20%20%20%20%20%20schema%3AbirthDate%20%20%22unknown%22%20.%0A%0Awd%3AQ12418%20%20dcterms%3Acreator%20%20dbr%3ALeonardo_da_Vinci%20%3B%0A%20%20%20%20%20%20%20%20dcterms%3Atitle%20%20%20%20%22Mona%20Lisa%22%20.%0A%0Ait%3A243FA%20%20dcterms%3Asubject%20%20wd%3AQ12418%20%3B%0A%20%20%20%20%20%20%20%20dcterms%3Atitle%20%20%20%20%22La%20Joconde%20%C3%A0%20Washington%22%40fr%20.&amp;dataFormat=TURTLE&amp;targetDataFormat=JSON-LD&amp;inference=NONE'/>} />
      <Route path="/links/i3" render={()=><Redirect to='/shExConvert?activeSchemaTab=%23schemaTextArea&schema=prefix%20schema%3A%20<http%3A%2F%2Fschema.org%2F>%20%0Aprefix%20xsd%3A%20%20%20<http%3A%2F%2Fwww.w3.org%2F2001%2FXMLSchema%23>%20%0Aprefix%20dcterms%3A%20<http%3A%2F%2Fpurl.org%2Fdc%2Fterms%2F>%20%0Aprefix%20it%3A%20%20%20%20<http%3A%2F%2Fdata.europeana.eu%2Fitem%2F>%20%0Aprefix%20foaf%3A%20%20<http%3A%2F%2Fxmlns.com%2Ffoaf%2F0.1%2F>%20%0A%0A<User>%20IRI%20%7B%20%0A%20a%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%5B%20foaf%3APerson%20%5D%3B%20%0A%20schema%3AbirthDate%20%20%20%20%20xsd%3Adate%3F%20%20%3B%0A%20foaf%3Aknows%20%20%20%20%20%20%20%20%20%20%20%40<User>%2A%20%3B%0A%20foaf%3Atopic_interest%20%20%40<Topic>%7B0%2C10%7D%0A%7D%0A%0A<Topic>%20%7B%0A%20%20dcterms%3Atitle%20%20%20xsd%3Astring%20%3B%0A%20%20dcterms%3Acreator%20IRI%20%3B%0A%20%20%5Edcterms%3Asubject%20%40<Item>%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%0A%7D%0A%0A<Item>%20%7B%0A%20%20dcterms%3Atitle%20%5B%40en%20%40fr%20%40es%5D%20%3B%0A%7D&schemaEmbedded=false&schemaEngine=ShEx&schemaFormat=ShExC&schemaFormatTextArea=ShExC&targetSchemaFormat=JSON-LD'/>} />
      <Route path="/links/i4" render={()=><Redirect to='/shExInfo?schema=prefix%20schema%3A%20%3Chttp%3A%2F%2Fschema.org%2F%3E%20%0Aprefix%20xsd%3A%20%20%20%3Chttp%3A%2F%2Fwww.w3.org%2F2001%2FXMLSchema%23%3E%20%0Aprefix%20dcterms%3A%20%3Chttp%3A%2F%2Fpurl.org%2Fdc%2Fterms%2F%3E%20%0Aprefix%20it%3A%20%20%20%20%3Chttp%3A%2F%2Fdata.europeana.eu%2Fitem%2F%3E%20%0Aprefix%20foaf%3A%20%20%3Chttp%3A%2F%2Fxmlns.com%2Ffoaf%2F0.1%2F%3E%20%0A%0A%3CUser%3E%20IRI%20%7B%20%0A%20a%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%5B%20foaf%3APerson%20%5D%3B%20%0A%20schema%3AbirthDate%20%20%20%20%20xsd%3Adate%3F%20%20%3B%0A%20foaf%3Aknows%20%20%20%20%20%20%20%20%20%20%20%40%3CUser%3E*%20%3B%0A%20foaf%3Atopic_interest%20%20%40%3CTopic%3E%7B0%2C10%7D%0A%7D%0A%0A%3CTopic%3E%20%7B%0A%20%20dcterms%3Atitle%20%20%20xsd%3Astring%20%3B%0A%20%20dcterms%3Acreator%20IRI%20%3B%0A%20%20%5Edcterms%3Asubject%20%40%3CItem%3E%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%0A%7D%0A%0A%3CItem%3E%20%7B%0A%20%20dcterms%3Atitle%20%5B%40en%20%40fr%20%40es%5D%20%3B%0A%7D&schemaFormat=ShExC&schemaEngine=ShEx' />} />
      <Route path="/links/i5" render={()=><Redirect to='/validate?data=%40prefix%20%3A%20%20%20%20%20%20%3Chttp%3A%2F%2Fexample.org%2F%3E%20.%0A%40prefix%20schema%3A%20%3Chttp%3A%2F%2Fschema.org%2F%3E%20.%0A%40prefix%20item%3A%20%20%3Chttp%3A%2F%2Fdata.europeana.eu%2Fitem%2F04802%2F%3E%20.%0A%40prefix%20dbr%3A%20%20%20%3Chttp%3A%2F%2Fdbpedia.org%2Fresource%2F%3E%20.%0A%40prefix%20xsd%3A%20%20%20%3Chttp%3A%2F%2Fwww.w3.org%2F2001%2FXMLSchema%23%3E%20.%0A%40prefix%20dcterms%3A%20%3Chttp%3A%2F%2Fpurl.org%2Fdc%2Fterms%2F%3E%20.%0A%40prefix%20it%3A%20%20%20%20%3Chttp%3A%2F%2Fdata.example.org%2Fitem%2F%3E%20.%0A%40prefix%20wd%3A%20%20%20%20%3Chttp%3A%2F%2Fwww.wikidata.org%2Fentity%2F%3E%20.%0A%40prefix%20foaf%3A%20%20%3Chttp%3A%2F%2Fxmlns.com%2Ffoaf%2F0.1%2F%3E%20.%0A%0A%3Aalice%20%20a%20%20%20%20%20%20%20foaf%3APerson%20.%0A%0A%3Abob%20%20%20%20a%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20foaf%3APerson%20%3B%0A%20%20%20%20%20%20%20%20schema%3AbirthDate%20%20%20%20%20%221990-07-04%22%5E%5Exsd%3Adate%20%3B%0A%20%20%20%20%20%20%20%20foaf%3Aknows%20%20%20%20%20%20%20%20%20%20%20%3Aalice%20%3B%0A%20%20%20%20%20%20%20%20foaf%3Atopic_interest%20%20wd%3AQ12418%20.%0A%0A%3Acarol%20%20a%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20foaf%3APerson%20%3B%0A%20%20%20%20%20%20%20%20schema%3AbirthDate%20%20%22unknown%22%20.%0A%0Awd%3AQ12418%20%20dcterms%3Acreator%20%20dbr%3ALeonardo_da_Vinci%20%3B%0A%20%20%20%20%20%20%20%20dcterms%3Atitle%20%20%20%20%22Mona%20Lisa%22%20.%0A%0Ait%3A243FA%20%20dcterms%3Asubject%20%20wd%3AQ12418%20%3B%0A%20%20%20%20%20%20%20%20dcterms%3Atitle%20%20%20%20%22La%20Joconde%20%C3%A0%20Washington%22%40fr%20.&amp;dataFormat=TURTLE&amp;schema=prefix%20schema%3A%20%3Chttp%3A%2F%2Fschema.org%2F%3E%20%0Aprefix%20xsd%3A%20%20%20%3Chttp%3A%2F%2Fwww.w3.org%2F2001%2FXMLSchema%23%3E%20%0Aprefix%20dcterms%3A%20%3Chttp%3A%2F%2Fpurl.org%2Fdc%2Fterms%2F%3E%20%0Aprefix%20it%3A%20%20%20%20%3Chttp%3A%2F%2Fdata.europeana.eu%2Fitem%2F%3E%20%0Aprefix%20foaf%3A%20%20%3Chttp%3A%2F%2Fxmlns.com%2Ffoaf%2F0.1%2F%3E%20%0A%0A%3CUser%3E%20IRI%20%7B%20%0A%20a%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%5B%20foaf%3APerson%20%5D%3B%20%0A%20schema%3AbirthDate%20%20%20%20%20xsd%3Adate%3F%20%20%3B%0A%20foaf%3Aknows%20%20%20%20%20%20%20%20%20%20%20%40%3CUser%3E*%20%3B%0A%20foaf%3Atopic_interest%20%20%40%3CTopic%3E%7B0%2C10%7D%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%0A%7D%0A%0A%3CTopic%3E%20%7B%0A%20%20dcterms%3Atitle%20%20%20xsd%3Astring%20%3B%0A%20%20dcterms%3Acreator%20IRI%20%3B%0A%20%20%5Edcterms%3Asubject%20%40%3CItem%3E%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%0A%7D%0A%0A%3CItem%3E%20%7B%0A%20%20dcterms%3Atitle%20%5B%40en%20%40fr%20%40es%5D%20%3B%0A%7D&amp;schemaFormat=ShExC&amp;schemaEngine=ShEx&amp;triggerMode=ShapeMap&amp;schemaEmbedded=false&amp;inference=NONE&amp;activeDataTab=%23dataTextArea&amp;activeSchemaTab=%23schemaTextArea&amp;activeShapeMapTab=%23shapeMapTextArea&amp;&amp;shapeMap=%3Abob%40%3CUser%3E%2C%3Acarol%40%3CUser%3E' />} />
      <Route component={NotFound} />
      </Switch>
     </Router>
  );

  // <Redirect to="/dataInfo?data=%40prefix%20%3A%20%20%20%20%20%20%3Chttp%3A%2F%2Fexample.org%2F%3E%20.%0A%40prefix%20schema%3A%20%3Chttp%3A%2F%2Fschema.org%2F%3E%20.%0A%40prefix%20item%3A%20%20%3Chttp%3A%2F%2Fdata.europeana.eu%2Fitem%2F04802%2F%3E%20.%0A%40prefix%20dbr%3A%20%20%20%3Chttp%3A%2F%2Fdbpedia.org%2Fresource%2F%3E%20.%0A%40prefix%20xsd%3A%20%20%20%3Chttp%3A%2F%2Fwww.w3.org%2F2001%2FXMLSchema%23%3E%20.%0A%40prefix%20dcterms%3A%20%3Chttp%3A%2F%2Fpurl.org%2Fdc%2Fterms%2F%3E%20.%0A%40prefix%20it%3A%20%20%20%20%3Chttp%3A%2F%2Fdata.example.org%2Fitem%2F%3E%20.%0A%40prefix%20wd%3A%20%20%20%20%3Chttp%3A%2F%2Fwww.wikidata.org%2Fentity%2F%3E%20.%0A%40prefix%20foaf%3A%20%20%3Chttp%3A%2F%2Fxmlns.com%2Ffoaf%2F0.1%2F%3E%20.%0A%0A%3Aalice%20%20a%20%20%20%20%20%20%20foaf%3APerson%20.%0A%0A%3Abob%20%20%20%20a%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20foaf%3APerson%20%3B%0A%20%20%20%20%20%20%20%20schema%3AbirthDate%20%20%20%20%20%221990-07-04%22%5E%5Exsd%3Adate%20%3B%0A%20%20%20%20%20%20%20%20foaf%3Aknows%20%20%20%20%20%20%20%20%20%20%20%3Chttp%3A%2F%2Fexample.org%2Falice%23me%3E%20%3B%0A%20%20%20%20%20%20%20%20foaf%3Atopic_interest%20%20wd%3AQ12418%20.%0A%0A%3Acarol%20%20a%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20foaf%3APerson%20%3B%0A%20%20%20%20%20%20%20%20schema%3AbirthDate%20%20%22unknown%22%20.%0A%0Awd%3AQ12418%20%20dcterms%3Acreator%20%20dbr%3ALeonardo_da_Vinci%20%3B%0A%20%20%20%20%20%20%20%20dcterms%3Atitle%20%20%20%20%22Mona%20Lisa%22%20.%0A%0Ait%3A243FA%20%20dcterms%3Asubject%20%20wd%3AQ12418%20%3B%0A%20%20%20%20%20%20%20%20dcterms%3Atitle%20%20%20%20%22La%20Joconde%20%C3%A0%20Washington%22%40fr%20.%0A&dataFormat=TURTLE&inference=NONE"/>
}

export default Routes;

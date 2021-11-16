import React from "react";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";
import About from "./About.js";
import API from "./API.js";
import "./App.css";
import DataVisualizeCyto from "./cytoscape/CytoVisualize.js";
import DataVisualizeCytoRaw from "./cytoscape/CytoVisualizeRaw.js";
import DataConvert from "./data/DataConvert.js";
import DataExtract from "./data/DataExtract.js";
import DataInfo from "./data/DataInfo.js";
import DataMerge from "./data/DataMerge";
import DataMergeVisualize from "./data/DataMergeVisualize";
import DataMergeVisualizeRaw from "./data/DataMergeVisualizeRaw.js";
import DataQuery from "./data/DataQuery.js";
import DataVisualize from "./data/DataVisualize.js";
import DataVisualizeRaw from "./data/DataVisualizeRaw.js";
import EndpointExtract from "./endpoint/EndpointExtract.js";
import EndpointInfo from "./endpoint/EndpointInfo.js";
import EndpointQuery from "./endpoint/EndpointQuery.js";
import Home from "./Home.js";
import NotFound from "./NotFound.js";
import PermalinkReceiver from "./PermalinkReceiver.js";
import RDFShapeNavbar from "./RDFShapeNavbar.js";
import SHACL2ShEx from "./shacl/SHACL2ShEx.js";
import SHACLConvert from "./shacl/SHACLConvert.js";
import SHACLInfo from "./shacl/SHACLInfo.js";
import SHACLValidate from "./shacl/SHACLValidate.js";
import ShapeMapInfo from "./shapeMap/ShapeMapInfo";
import ShapeForm from "./shex/ShapeForm.js";
import ShEx2Shacl from "./shex/ShEx2Shacl.js";
import ShEx2XMI from "./shex/ShEx2XMI.js";
import ShExConvert from "./shex/ShExConvert.js";
import ShExInfo from "./shex/ShExInfo.js";
import ShExValidate from "./shex/ShExValidate.js";
import ShExValidateEndpoint from "./shex/ShExValidateEndpoint.js";
import ShExVisualize from "./shex/ShExVisualize.js";
import ShExVisualizeCytoscape from "./shex/ShExVisualizeCytoscape.js";
import ShExVisualizeRaw from "./shex/ShExVisualizeRaw.js";
import TestCode from "./test/TestCode.js";
import TestCyto from "./test/TestCyto.js";
import TestGithubSearch from "./test/TestGithubSearch.js";
import TestRDFArea from "./test/TestRDFArea.js";
import TestSearch from "./test/TestSearch.js";
// Only for testing
import TestYashe from "./test/TestYashe.js";
import TestYasqe from "./test/TestYasqe.js";
import TestYate from "./test/TestYate.js";
import WikidataExtract from "./wikidata/WikidataExtract.js";
import WikidataQuery from "./wikidata/WikidataQuery.js";
import WikidataValidate from "./wikidata/WikidataValidate.js";

function Routes() {
  const renderWithNavbar = (Component) => {
    return (
      <>
        <RDFShapeNavbar />
        {renderWithoutNavbar(Component)}
      </>
    );
  };

  const renderWithoutNavbar = (Component) => {
    // eslint-disable-next-line no-restricted-globals
    const loc = location;
    return <Component location={loc.search ? loc : undefined} />;
  };

  return (
    <Router>
      <Switch>
        <Route path="/" exact render={() => renderWithNavbar(Home)} />
        <Route
          path={API.routes.client.dataInfoRoute}
          render={() => renderWithNavbar(DataInfo)}
        />
        <Route
          path={API.routes.client.dataConvertRoute}
          render={() => renderWithNavbar(DataConvert)}
        />
        <Route
          path={API.routes.client.dataVisualizeRoute}
          render={() => renderWithNavbar(DataVisualize)}
        />
        {/* RAW visualization */}
        <Route
          path={API.routes.client.dataVisualizeRouteRaw}
          render={() => renderWithoutNavbar(DataVisualizeRaw)}
        />
        <Route
          path={API.routes.client.cytoVisualizeRoute}
          render={() => renderWithNavbar(DataVisualizeCyto)}
        />
        {/* RAW visualization */}
        <Route
          path={API.routes.client.cytoVisualizeRouteRaw}
          render={() => renderWithoutNavbar(DataVisualizeCytoRaw)}
        />
        <Route
          path={API.routes.client.dataQueryRoute}
          render={() => renderWithNavbar(DataQuery)}
        />
        <Route
          path={API.routes.client.dataExtractRoute}
          render={() => renderWithNavbar(DataExtract)}
        />
        <Route
          path={API.routes.client.dataMergeRoute}
          render={() => renderWithNavbar(DataMerge)}
        />
        <Route
          path={API.routes.client.dataMergeVisualizeRoute}
          render={() => renderWithNavbar(DataMergeVisualize)}
        />
        {/* RAW visualization */}
        <Route
          path={API.routes.client.dataMergeVisualizeRouteRaw}
          render={() => renderWithoutNavbar(DataMergeVisualizeRaw)}
        />

        <Route
          path={API.routes.client.endpointInfoRoute}
          render={() => renderWithNavbar(EndpointInfo)}
        />
        <Route
          path={API.routes.client.endpointQueryRoute}
          render={() => renderWithNavbar(EndpointQuery)}
        />
        <Route
          path={API.routes.client.endpointExtractRoute}
          render={() => renderWithNavbar(EndpointExtract)}
        />

        <Route
          path={API.routes.client.shExValidateRoute}
          render={() => renderWithNavbar(ShExValidate)}
        />
        <Route
          path={API.routes.client.shExValidateEndpointRoute}
          render={() => renderWithNavbar(ShExValidateEndpoint)}
        />
        <Route
          path={API.routes.client.shExInfoRoute}
          render={() => renderWithNavbar(ShExInfo)}
        />
        <Route
          path={API.routes.client.shExVisualizeRoute}
          render={() => renderWithNavbar(ShExVisualize)}
        />
        {/* RAW visualization */}
        <Route
          path={API.routes.client.shExVisualizeRouteRaw}
          render={() => renderWithoutNavbar(ShExVisualizeRaw)}
        />
        <Route
          path={API.routes.client.shExVisualizeCytoscapeRoute}
          render={() => renderWithNavbar(ShExVisualizeCytoscape)}
        />
        <Route
          path={API.routes.client.shExConvertRoute}
          render={() => renderWithNavbar(ShExConvert)}
        />
        <Route
          path={API.routes.client.shEx2ShaclRoute}
          render={() => renderWithNavbar(ShEx2Shacl)}
        />
        <Route
          path={API.routes.client.shEx2XMIRoute}
          render={() => renderWithNavbar(ShEx2XMI)}
        />

        <Route
          path={API.routes.client.shapeFormRoute}
          render={() => renderWithNavbar(ShapeForm)}
        />

        <Route
          path={API.routes.client.shaclInfoRoute}
          render={() => renderWithNavbar(SHACLInfo)}
        />
        <Route
          path={API.routes.client.shaclValidateRoute}
          render={() => renderWithNavbar(SHACLValidate)}
        />
        <Route
          path={API.routes.client.shaclConvertRoute}
          render={() => renderWithNavbar(SHACLConvert)}
        />
        <Route
          path={API.routes.client.shacl2ShExRoute}
          render={() => renderWithNavbar(SHACL2ShEx)}
        />

        <Route
          path={API.routes.client.shapemapInfoRoute}
          render={() => renderWithNavbar(ShapeMapInfo)}
        />

        <Route
          path={API.routes.client.wikidataQueryRoute}
          render={() => renderWithNavbar(WikidataQuery)}
        />
        <Route
          path={API.routes.client.wikidataValidateRoute}
          render={() => renderWithNavbar(WikidataValidate)}
        />
        <Route
          path={API.routes.client.wikidataExtractRoute}
          render={() => renderWithNavbar(WikidataExtract)}
        />
        <Route path={API.routes.client.aboutRoute} render={() => renderWithNavbar(About)} />

        {/*The following route is for backwards compatibility*/}
        <Route path="/validate" render={() => renderWithNavbar(ShExValidate)} />

        <Route path="/test/yashe" render={() => renderWithNavbar(TestYashe)} />
        <Route path="/test/yasqe" render={() => renderWithNavbar(TestYasqe)} />
        <Route
          path="/test/rdfArea"
          render={() => renderWithNavbar(TestRDFArea)}
        />
        <Route path="/test/cyto" render={() => renderWithNavbar(TestCyto)} />
        <Route path="/test/code" render={() => renderWithNavbar(TestCode)} />
        <Route path="/test/turtle" render={() => renderWithNavbar(TestYate)} />
        <Route
          path="/test/search"
          render={() => renderWithNavbar(TestSearch)}
        />
        <Route
          path="/test/github"
          render={() => renderWithNavbar(TestGithubSearch)}
        />
        <Route
          path={API.routes.client.permalinkRoute}
          component={PermalinkReceiver}
          // render={() => renderWithNavbar(PermalinkReceiver)}
        />
        <Route render={() => renderWithNavbar(NotFound)} />
      </Switch>
    </Router>
  );
}

export default Routes;

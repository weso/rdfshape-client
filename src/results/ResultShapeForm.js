import React, { Fragment, useEffect, useState } from "react";
import { Tab, Tabs } from "react-bootstrap";
import format from "xml-formatter";
import API from "../API";
import ByText from "../components/ByText";
import { Permalink } from "../Permalink";
import PrintJson from "../utils/PrintJson";
import { scrollToResults, yasheResultButtonsOptions } from "../utils/Utils";

function ResultShapeForm({ result: shapeFormResult, permalink, disabled }) {
  // Destructure response items for later usage
  const { form, message } = shapeFormResult;

  const [resultTab, setResultTab] = useState(API.tabs.html);
  // TODO: adapt this results to show:
  // TAB1: the HTML code in a <Code> of type XML(?)
  // TAB2: the rendering of the form

  useEffect(
    setFormEvents,
    [] // Add the event handlers ONCE
  );

  useEffect(scrollToResults, []);

  // Prepare the newly created form JS events
  function setFormEvents() {
    const shexgForm = document.getElementById("shexgform");
    const checkButton = document.getElementById("checkbtn");
    const newButtons = document.querySelectorAll(".newButton");

    for (const button of newButtons) {
      button.addEventListener("click", () => {
        // Get the last input element before the "new button", as a template
        const lastInputInGroup = button.previousSibling;
        // Empty the input value and use a proper id/name
        const newInput = lastInputInGroup.cloneNode(true);
        newInput.value = "";

        const baseId = lastInputInGroup.getAttribute("id");
        const idParts = baseId.split("-");

        const newId = `${idParts[0]}-${
          idParts.length === 1 ? 1 : parseInt(idParts[1]) + 1
        }`;

        newInput.setAttribute("id", newId);
        newInput.setAttribute("name", newId);

        // Insert the new input element before the "new button" with the right id/name
        lastInputInGroup.parentElement.insertBefore(newInput, button);
      });
    }

    // Check and submit
    checkButton.addEventListener("click", () => {
      if (!shexgForm.checkValidity()) {
        shexgForm.querySelector("[type=submit]").click();
      }
    });
  }

  if (shapeFormResult) {
    return (
      <div id={API.resultsId}>
        <Tabs activeKey={resultTab} onSelect={setResultTab} id="resultTabs">
          {/* HTML code for the generated form */}
          <Tab eventKey={API.tabs.html} title={API.texts.resultTabs.result}>
            <ByText
              textAreaValue={format(form, {
                indentation: "  ",
              })} // Pretty print generated HTML
              textFormat={API.formats.xml}
              fromParams={false}
              readonly={true}
              options={{ ...yasheResultButtonsOptions }}
            />
          </Tab>
          {/* Rendering of the generated HTML form */}
          <Tab eventKey={API.tabs.render} title={API.texts.resultTabs.render}>
            <div id="resultform" dangerouslySetInnerHTML={{ __html: form }} />
          </Tab>
        </Tabs>

        <hr />

        <details>
          <summary>{API.texts.responseSummaryText}</summary>
          <PrintJson json={shapeFormResult} />
        </details>
        {permalink && (
          <Fragment>
            <Permalink url={permalink} disabled={disabled} />
          </Fragment>
        )}
      </div>
    );
  }
}

export default ResultShapeForm;

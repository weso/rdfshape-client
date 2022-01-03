import React, { Fragment, useEffect } from "react";
import Alert from "react-bootstrap/Alert";
import API from "../API";
import { Permalink } from "../Permalink";
import PrintJson from "../utils/PrintJson";

function ResultShapeForm({ result: shapeFormResult, permalink, disabled }) {
  // Destructure response items for later usage
  const { form, message } = shapeFormResult;

  useEffect(
    setFormEvents,
    [] // Add the event handlers ONCE
  );

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
      <div>
        <Alert variant="success">{message}</Alert>
        {/* Insert the generated HTML-Form in a div */}
        <div id="resultform" dangerouslySetInnerHTML={{ __html: form }} />
        <br />
        <details>
          <summary>{API.texts.responseSummaryText}</summary>
          <PrintJson json={shapeFormResult} />
        </details>
        {permalink && (
          <Fragment>
            <hr />
            <Permalink url={permalink} disabled={disabled} />
          </Fragment>
        )}
      </div>
    );
  }
}

export default ResultShapeForm;

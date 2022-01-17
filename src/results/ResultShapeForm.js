import $ from "jquery";
import React, { Fragment, useEffect, useState } from "react";
import Alert from "react-bootstrap/Alert";
import { Permalink } from "../Permalink";

function ResultShapeForm({result, ...props})  {
  let msg;

  const [activeTab, setActiveTab] = useState(props.activeTab);

  function handleTabChange(e) {
    setActiveTab(e);
  }

    useEffect(() => {
	    $("#resultform").html(result.result);

      $( ".newButton" ).each(function(index) {
        $(this).on("click", function(){
          let id = $(this).prev().attr("id").replace(":", "\\:");
          $(this).prev().clone().insertAfter("#container-" + id);
        });
		  });

      $("#checkbtn").click(function() {
        if(! $("#shexgform")[0].checkValidity()) {
          $("#shexgform").find(':submit').click();
        }
      });
	});

  if (result === "") {
    msg = null;
  } else if (result.error || result.msg.toLowerCase().includes("error")) {
    msg = (
      <div>
        <Alert variant="danger">Invalid ShEx schema</Alert>
        <ul>
          <li className="word-break">{result.error || result.msg}</li>
        </ul>
      </div>
    );
  } else {
    msg = (
		<div>
		  <div id="resultform">

		  </div>
		  <div>
		  {props.permalink && (
			  <Fragment>
				<hr />
				<Permalink url={props.permalink} disabled={props.disabled} />
			  </Fragment>
		   )}
		   </div>
	    </div>
    );
  }

  return <div>{msg}</div>;
}

export default ResultShapeForm;

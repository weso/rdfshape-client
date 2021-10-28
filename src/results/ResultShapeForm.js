import $ from "jquery";
import React, { useEffect, useState } from "react";
import Alert from "react-bootstrap/Alert";

function ResultShapeForm({result, ...props})  {
  let msg;

  const [activeSource, setActiveSource] = useState(props.activeSource);

  function handleTabChange(e) {
    setActiveSource(e);
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
      <div id="resultform">

      </div>
    );
  }

  return <div>{msg}</div>;
}

export default ResultShapeForm;

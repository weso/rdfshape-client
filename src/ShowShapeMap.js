import React from 'react';
// import Table from "react-bootstrap/Table";
import BootstrapTable from 'react-bootstrap-table-next';

function showQualify(node, prefix) {
    console.log("showQualify node)");
    console.log(node);
    var relativeBaseRegex = /^<internal:\/\/base\/(.*)>$/g;
    var matchBase = relativeBaseRegex.exec(node);
    if (matchBase) {
        var rawNode = matchBase[1];
        return "<" + rawNode + ">";
    } else {
        var iriRegexp = /^<(.*)>$/g;
        var matchIri = iriRegexp.exec(node);
        if (matchIri) {
            var rawNode = matchIri[1];
            for (var key in prefix) {
                if (rawNode.startsWith(prefix[key])) {
                    var localName = rawNode.slice(prefix[key].length);
                    console.log("qualifying " + localName)
                    /*       if (localName.indexOf("/") > -1) {
                            return "&lt;" + rawNode + "&gt;" ;
                           } else */
                    var longNode = "<" + rawNode + ">";
                    return <abbr title={longNode + key}>{":" + localName}</abbr> ;
                }
            }
            return <a href={rawNode}>{"<" + rawNode + ">"}</a>;
        }
        if (node.match(/^[0-9\"\'\_]/)) return node;
        console.log("Unknown format for node: " + node);
        return node;
    }
}

function shapeMap2Table(shapeMap, nodesPrefixMap, shapesPrefixMap) {
   console.log("ShapeMap: " + shapeMap)
   return shapeMap.map((assoc,key) => ({
      'id': key,
      'node': showQualify(assoc.node, nodesPrefixMap),
      'shape': showQualify(assoc.shape, shapesPrefixMap),
      'status': assoc.status,
      'details': assoc.reason
    }))
}

function shapeFormatter(cell, row) {
    if (row.status ==='conformant') {
        return (<span style={ { color:'green'} }>{cell}</span> );
    } else
        return (<span style={ {color: 'red'}}>!{cell}</span> );
}

function detailsFormatter(cell, row) {
    console.log("DetailsFormatter, cell: " + cell + " Row: " + row)
    return (
        <details>
         <pre>{row.details}</pre>
        </details> );
}

function ShowShapeMap(props) {
    const table = shapeMap2Table(props.shapeMap, props.nodesPrefixMap, props.shapesPrefixMap)
    console.log("Table data: " + table)
    const columns = [
        { dataField: 'id',
            text: "Id",
            sort: true
        },
        { dataField: 'node',
          text: "Node",
          sort: true
        },
        { dataField: 'shape',
            text: "Shape",
            sort: true,
            formatter: shapeFormatter
        },
        { dataField: 'status',
          hidden: true
        },
        { dataField: 'evidence',
            text: "Details",
            formatter: detailsFormatter
        },
    ];

    return <BootstrapTable
         keyField='id'
         data={table}
         columns={columns}
         striped
         hover
         condensed     />
}

export default ShowShapeMap;

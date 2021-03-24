import { parseData } from "../ParseQueryResult";

test("parseData example", async () => {
  const result = {
    head: { vars: ["x", "y"] },
    results: {
      bindings: [
        {
          x: { type: "uri", value: "http://wikiba.se/ontology#Dump" },
          y: { type: "uri", value: "http://schema.org/Dataset" },
        },
      ],
    },
  };

  const parsed = parseData(result);
  const parsedString = JSON.stringify(parsed);

  const expected = {
    columns: [
      { dataField: "x", text: "x", sort: true },
      { dataField: "y", text: "y", sort: true },
    ],
    rows: [
      {
        _id: 0,
        x: {
          type: "a",
          key: null,
          ref: null,
          props: {
            href: "http://wikiba.se/ontology#Dump",
            children: "<http://wikiba.se/ontology#Dump>",
          },
          _owner: null,
          _store: {},
        },
        y: {
          type: "a",
          key: null,
          ref: null,
          props: {
            href: "http://schema.org/Dataset",
            children: "<http://schema.org/Dataset>",
          },
          _owner: null,
          _store: {},
        },
      },
    ],
  };
  const expectedString = JSON.stringify(expected);

  /*    const expected = {
        "rows": [
            { "dataField": "x", "sort": true, "text": "x" },
            { "dataField": "y", "sort": true, "text": "y" },
        ],
        "columns": [
            { "_id": 0,
                "x": <a href="http://wikiba.se/ontology#Dump">&lt;http://wikiba.se/ontology#Dump&gt;</a>,
                "y": <a href="http://schema.org/Dataset">&lt;http://schema.org/Dataset&gt;</a>
            },
        ]
    }; */
  // expect(parsed).toBe(expected);
  expect(parsedString).toBe(expectedString);
});

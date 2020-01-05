import {cnvValueFromSPARQL, showQualified, showQualify} from "../utils/Utils";

export function parseData(data, prefixes) {
    if (data.head && data.head.vars && data.head.vars.length) {
        const vars = data.head.vars;
        const columns = vars.map(v => {
            return {
                dataField: v,
                text: v,
                sort: true
            }
        });
        const rows = data.results.bindings.map((binding, idx) => {
            let row = {_id: idx};
            vars.map(v => {
                const b = binding[v]
                const converted = cnvValueFromSPARQL(b);
                const qualify = showQualify(converted, prefixes);
                const value = showQualified(qualify, prefixes);
                row[v] = value
            });
            return row;
        });
        return {
            columns: columns,
            rows: rows
        }
    } else {
        return [];
    }
}
import FormGenerator from "./html-gen/FormGenerator.js";
const shexp = require("shex").Parser;

class ShExParser {
  constructor() {
    this.source = "";

    this.shexparser = shexp.construct();
    this.shexparser._setBase("http://example.org/");
    this.shexparser._setFileName("Shapes.shex");

    this.fg = new FormGenerator();

    this.prefixes = new Map();
  }

  resetParser() {
    this.shexparser.reset();
  }

  parseShExToForm(shex) {
    let form = '<form id="shexgform" class="wikidata">';

    let source = this.parseShEx(shex);

    //Guardar prefijos
    this.prefixes.set(source.base, "base");
    for (let prefix in source.prefixes) {
      this.prefixes.set(source.prefixes[prefix], prefix);
    }

    //El formulario será el de la shape start
    if (source.start) {
      this.fg.prefixes = this.prefixes;
      this.fg.shapes = source.shapes;
      form += this.fg.createForm(
        source.shapes[source.start.reference],
        source.start.reference
      );
    }

    form += '<button type="button" id="checkbtn" class="btn1">Check</button>';
    form += '<input type="submit" style="display: none;"/>';
    form += "</form>";

    return form;
  }

  /**
   * Parsea ShEx y devuelve un JSON
   * @param shex ShEx
   * @returns {JSON}  ShEx parseado
   */
  parseShEx(shex) {
    try {
      this.source = this.shexparser.parse(shex);
    } catch (ex) {
      console.error(ex);
      return null;
    }
    return this.source;
  }
}

export default ShExParser;

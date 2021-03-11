
class FormGenerator {

    constructor () {
		this.prefixes = null;
		this.shapes = null;
		this.current = "";
		this.main = "";
		this.recursividad = 0;
    }
	
	createForm(shape, shName) {
		this.recursividad++;
		if(this.recursividad > 4) return "";	
		let mainLabel = null;
		this.current = shName;
		//Nombre del formulario
		if(shape.annotations) {
			mainLabel = this.getAnnotations(shape.annotations).label;
		}
		if(!mainLabel) {
			mainLabel = this.getPrefixedTerm(shName);
		}
		let form = `<h3>${mainLabel}</h3>`;
		
		
		if(shape.expression && shape.expression.expressions) {
			for(let i = 0; i < shape.expression.expressions.length; i++) {
				form += this.checkExpression(shape.expression.expressions[i]);
			}
		}
		else if (shape.expression) {
			form += this.checkExpression(shape.expression);
		}
		
		return form;
	}
	
	checkExpression(exp) {
		if(exp.type === "TripleConstraint") {
			return this.checkTripleConstraint(exp);
		}
		else if(exp.type === "OneOf") {
			let div = '<div class="orform">';
			for(let i = 0; i < exp.expressions.length; i++) {
					if(i > 0) {
						div += "<h3>OR</h3>";
					}
					div += this.checkExpression(exp.expressions[i]);
			}
			div += '</div>';
			return div;
		}
		else if(exp.type === "EachOf") {
			let tcs = "";
			for(let i = 0; i < exp.expressions.length; i++) {
					tcs += this.checkExpression(exp.expressions[i]);
			}
			return tcs;
		}
	}
	
	checkTripleConstraint(exp) {
		if(exp.predicate === "http://www.w3.org/1999/02/22-rdf-syntax-ns#type") {
			if(exp.valueExpr.values.length <= 1) {
				return "";
			}
			else {
				let id = this.current + "-a";
				let label = "a";
				let res = this.getAnnotations(exp.annotations);
				if(res.label !== "") {
					label = res.label;
				}
				let required = "required";
				if(exp.min === 0) {
					required="";
				}
				let button = this.getAddButton(exp.max);
				let idDiv = "container-" + id;
				let sel = `<label for="${id}">${label}:</label><div id="${idDiv}"><select id="${id}" name="${id}" ${required}>`;
				sel += `<option></option>`;
				for(let i = 0; i < exp.valueExpr.values.length; i++) {
					let pValue = this.getPrefixedTerm(exp.valueExpr.values[i]);
					sel += `<option value="${pValue}">${pValue}</option>`;
				}
				sel += `</select>${button}</div>`;
				return sel;
			}
		}
		else if(exp.valueExpr && exp.valueExpr.type === "NodeConstraint") {
			let id = this.getPrefixedTerm(exp.predicate);
			let label = id;
			let readonly = "";
			if(exp.annotations) {
				let res = this.getAnnotations(exp.annotations);
				if(res.label !== "") {
					label = res.label;
				}
				readonly = res.readonly;
			}
			if(exp.valueExpr.values) {	// [...]
				if(exp.valueExpr.values.length === 1) return "";
				let required = "required";
				if(exp.min === 0) {
					required="";
				}
				let button = this.getAddButton(exp.max);
				let idDiv = "container-" + id;
				let select = `<label for="${id}">${label}:</label><div id="${idDiv}"><select id="${id}" name="${id}" ${required}>`;
				select += `<option></option>`;
				for(let i = 0; i < exp.valueExpr.values.length; i++) {
					let valor = exp.valueExpr.values[i].value ? exp.valueExpr.values[i].value : this.getPrefixedTerm(exp.valueExpr.values[i]);
					select += `<option value="${valor}">${valor}</option>`;
				}
				select += `</select>${button}</div>`;
				return select;
			}
			else {
				let type = this.determineType(exp.valueExpr);
				let facetas = this.getFacets(exp.valueExpr);
				let required = "required";
				if(exp.min === 0) {
					required="";
				}
				let idDiv = "container-" + id;
				let button = this.getAddButton(exp.max, id);	
				return `<label for="${id}">${label}:</label>` +
						`<div id="${idDiv}"><input type="${type}" id="${id}" name="${id}" ${readonly} ${required} ${facetas}>${button}</div>`;
			}
			
		}
		else if(exp.valueExpr && exp.valueExpr.type === "ShapeRef") {
			let div = "";
			let refShape = this.shapes[exp.valueExpr.reference];
			if(refShape.type === "NodeConstraint") {
				let id = this.getPrefixedTerm(exp.predicate);
				let label = id;
				let res = this.getAnnotations(exp.annotations);
				if(res.label !== "") { label = res.label; }
				let required = "required";
				if(exp.min === 0) {
					required="";
				}
				let button = this.getAddButton(exp.max);
				let idDiv = "container-" + id;
				div = `<label for="${id}">${label}:</label><div id="${idDiv}"><select id="${id}" name="${id}" ${required}>`;
				div += `<option></option>`;
				for(let i = 0; i < refShape.values.length; i++) {
					let valor = refShape.values[i].value ? refShape.values[i].value : this.getPrefixedTerm(refShape.values[i]);
					div += `<option value="${valor}">${valor}</option>`;
				}
				div += `</select>${button}</div>`;
			}
			else {
				if(this.current === exp.valueExpr.reference) return "";
				//Guardamos la shape actual
				let prev = this.current;
				div = '<div class="innerform">';
				div += this.createForm(refShape, exp.valueExpr.reference);
				//Recuperamos el valor
				this.current = prev;
				this.recursividad--;
				div += '</div>';
			}
			return div;
		}
		else if(!exp.valueExpr) {	// . ;
			let id = this.getPrefixedTerm(exp.predicate);
			let label = id;
			let readonly = "";
			let required = "required";
				if(exp.min === 0) {
					required="";
				}
			if(exp.annotations) {
				let res = this.getAnnotations(exp.annotations);
				if(res.label !== "") { label = res.label; }
				readonly = res.readonly;
			}
			let idDiv = "container-" + id;
			let button = this.getAddButton(exp.max);
			return `<label for="${id}">${label}:</label>` +
					`<div id="${idDiv}"><input type="text" id="${id}" name="${id}" ${readonly} ${required}>${button}</div>`;
		}
	}
	
	getAnnotations(ans) {
		let label = "";
		let readonly = "";
		for(let i = 0; i < ans.length; i++) {
			if(ans[i].predicate === "http://www.w3.org/ns/ui#label") {
				label = ans[i].object.value;
			}
			else if(ans[i].predicate === "http://janeirodigital.com/layout#readonly") {
				readonly = `readonly=${ans[i].object.value}`;
			}
		}
		return {
			label: label,
			readonly: readonly
		}
	}
	
	determineType(ve) {
		if(ve.nodeKind === "iri") {
			return "url";
		}
		if(ve.datatype === "http://www.w3.org/2001/XMLSchema#integer" || ve.datatype === "http://www.w3.org/2001/XMLSchema#int") {
			return "number";
		}
		return "text";
	}
	
	getFacets(ve) {
		let fcs = "";
		if(ve.minlength) {
			fcs += `minlength=${ve.minlength}`
		}
		if(ve.maxlength) {
			fcs += ` maxlength=${ve.maxlength}`
		}
		if(ve.length) {
			fcs += ` minlength=${ve.length} maxlength=${ve.length}`
		}
		if(ve.minexclusive) {
			let mex = ve.minexclusive + 1;
			fcs += ` min=${mex}`
		}
		if(ve.mininclusive) {
			fcs += ` min=${ve.mininclusive}`
		}
		if(ve.maxexclusive) {
			let mex = ve.maxexclusive - 1;
			fcs += ` max=${mex}`
		}
		if(ve.maxinclusive) {
			fcs += ` max=${ve.maxinclusive}`
		}
		if(ve.pattern) {
			fcs += ` pattern=${ve.pattern}`
		}
		return fcs;
	}
	
	getAddButton(max, id) {
		if(!max || max === 1) {
			return "";
		}
		let button = `<a class="button newButton">+</a>`;
		return button;
	}

    clear() {
    }
	
	getPrefixedTerm(iri) {
		for (const [key, value] of this.prefixes.entries()) {
			if(iri.includes(key)) {
				if(value !== "base") {
					return value + ":" + iri.replace(key, "");
				}
                else {
					let term = iri.replace(key, "");
					return `&lt;${term}&gt;`
				}
            }
		}
    }

}
module.exports = FormGenerator;
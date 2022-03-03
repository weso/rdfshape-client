// Items used for the examples displayed on the navbar
class Examples {
  static dataInfoExample = `
@prefix :      <http://example.org/> .
@prefix schema: <http://schema.org/> .
@prefix item:  <http://data.europeana.eu/item/04802/> .
@prefix dbr:   <http://dbpedia.org/resource/> .
@prefix xsd:   <http://www.w3.org/2001/XMLSchema> .
@prefix dcterms: <http://purl.org/dc/terms/> .
@prefix it:    <http://data.example.org/item/> .
@prefix wd:    <http://www.wikidata.org/entity/> .
@prefix foaf:  <http://xmlns.com/foaf/0.1/> .

:alice  a       foaf:Person .

:bob    a                    foaf:Person ;
        schema:birthDate     "1990-07-04"^^xsd:date ;
        foaf:knows           :alice ;
        foaf:topic_interest  wd:Q12418 .

:carol  a                 foaf:Person ;
        schema:birthDate  "unknown" .

wd:Q12418  dcterms:creator  dbr:Leonardo_da_Vinci ;
        dcterms:title    "Mona Lisa" .

it:243FA  dcterms:subject  wd:Q12418 ;
        dcterms:title    "La Joconde à Washington"@fr .`;

  static dataQueryExampleData = `
PREFIX :       <http://example.org/>
PREFIX schema: <http://schema.org/>
PREFIX xsd:    <http://www.w3.org/2001/XMLSchema>
PREFIX foaf:   <http://xmlns.com/foaf/0.1/>

:alice schema:name           "Alice" ;
        schema:gender         schema:Female ;
        schema:knows          :bob .

:bob   schema:gender         schema:Male ;
        schema:name           "Robert";
        schema:birthDate      "1980-03-10"^^xsd:date .

:carol schema:name           "Carol" ;
        schema:gender         "unspecified" ;
        foaf:name             "Carol" .

:dave  schema:name           "Dave";
        schema:gender         "XYY";
        schema:birthDate      1980 .

:emily schema:name "Emily", "Emilee" ;
        schema:gender         schema:Female .

:frank foaf:name             "Frank" ;
        schema:gender:        schema:Male .

:grace schema:name           "Grace" ;
        schema:gender         schema:Male ;
        schema:knows          _:x .

:harold schema:name         "Harold" ;
        schema:gender       schema:Male ;
        schema:knows        :grace .`;

  static dataQueryExampleQuery = `
# Get all people with their name and gender

PREFIX schema: <http://schema.org/>

select ?person ?name ?gender where {
  ?person schema:name ?name .
  ?person schema:gender ?gender
}`;

  static shexValidateExampleData = `
PREFIX :       <http://example.org/>
PREFIX schema: <http://schema.org/>
PREFIX xsd:    <http://www.w3.org/2001/XMLSchema#>
PREFIX foaf:   <http://xmlns.com/foaf/0.1/>

:alice schema:name           "Alice" ;            # %* \Passes{:User} *)
       schema:gender         schema:Female ;
       schema:knows          :bob .

:bob   schema:gender         schema:Male ;        # %* \Passes{:User} *)
       schema:name           "Robert";
       schema:birthDate      "1980-03-10"^^xsd:date .

:carol schema:name           "Carol" ;            # %* \Passes{:User} *)
       schema:gender         "unspecified" ;
       foaf:name             "Carol" .

:dave  schema:name           "Dave";         # %* \Fails{:User} *)
       schema:gender         "XYY";          #
       schema:birthDate      1980 .          # %* 1980 is not an xsd:date *)

:emily schema:name "Emily", "Emilee" ;       # %* \Fails{:User} *)
       schema:gender         schema:Female . # %* too many schema:names *)

:frank foaf:name             "Frank" ;       # %* \Fails{:User} *)
       schema:gender:        schema:Male .   # %* missing schema:name *)

:grace schema:name           "Grace" ;       # %* \Fails{:User} *)
       schema:gender         schema:Male ;   #
       schema:knows          _:x .           # %* \_:x is not an IRI *)

:harold schema:name         "Harold" ;    # %* \Fails{:User} *)
        schema:gender       schema:Male ;
        schema:knows        :grace .      # %* :grace does not conform to :User *)
  `;
  static shexValidateExampleSchema = `
PREFIX :       <http://example.org/>
PREFIX schema: <http://schema.org/>
PREFIX xsd:  <http://www.w3.org/2001/XMLSchema#>

:User {
  schema:name          xsd:string  ;
  schema:birthDate     xsd:date?  ;
  schema:gender        [ schema:Male schema:Female ] OR xsd:string ;
  schema:knows         IRI @:User*
}
  `;
  static shexValidateExampleShapeMap = `
:alice@:User,:bob@:User,:carol@:User,:emily@:User,:frank@:User,:grace@:User,:harold@:User
  `;

  static shaclValidateExampleData = `
@prefix :       <http://example.org/> .
@prefix sh:     <http://www.w3.org/ns/shacl#> .
@prefix xsd:    <http://www.w3.org/2001/XMLSchema#> .
@prefix schema: <http://schema.org/> .
@prefix foaf:   <http://xmlns.com/foaf/0.1/> .
@prefix rdfs:   <http://www.w3.org/2000/01/rdf-schema#> .


:alice a :User;                             #%*\Passes{:UserShape} *)
        schema:name           "Alice" ;
        schema:gender         schema:Female ;
        schema:knows          :bob .

:bob   a :User;                             #%*\Passes{:UserShape} *)
        schema:gender         schema:Male ;
        schema:name           "Robert";
        schema:birthDate      "1980-03-10"^^xsd:date .

:carol a :User;                             #%*\Passes{:UserShape} *)
        schema:name           "Carol" ;
        schema:gender         schema:Female ;
        foaf:name             "Carol" .
  `;
  static shaclValidateExampleSchema = `
@prefix :       <http://example.org/> .
@prefix sh:     <http://www.w3.org/ns/shacl#> .
@prefix xsd:    <http://www.w3.org/2001/XMLSchema#> .
@prefix schema: <http://schema.org/> .
@prefix foaf:   <http://xmlns.com/foaf/0.1/> .
@prefix rdfs:   <http://www.w3.org/2000/01/rdf-schema#> .

:UserShape a sh:NodeShape;
   sh:targetClass :User ;
   sh:property [                  # Blank node 1
    sh:path     schema:name ;
    sh:minCount 1;
    sh:maxCount 1;
    sh:datatype xsd:string ;
  ] ;
  sh:property [                   # Blank node 2
   sh:path schema:gender ;
   sh:minCount 1;
   sh:maxCount 1;
   sh:or (
    [ sh:in (schema:Male schema:Female) ]
    [ sh:datatype xsd:string]
   )
  ] ;
  sh:property [                   # Blank node 3
   sh:path     schema:birthDate ;
   sh:maxCount 1;
   sh:datatype xsd:date ;
  ] ;
  sh:property [                   # Blank node 4
   sh:path     schema:knows ;
   sh:nodeKind sh:IRI ;
   sh:class    :User ;
  ] .
  `;

  static wikidataQueryExampleEndpoint = `https://query.wikidata.org/sparql`;
  static wikidataQueryExampleQuery = `
# Some subjects of the Marvel Universe

SELECT ?char ?charName (GROUP_CONCAT(DISTINCT ?typeLabel;separator=", ") AS ?types) (GROUP_CONCAT(DISTINCT ?universeLabel;separator=", ") AS ?universes)
WHERE {
  ?char wdt:P1080 wd:Q931597;
          wdt:P31 ?type ;
          wdt:P1080 ?universe .
  SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en".
                          ?char rdfs:label ?charName .
                          ?universe rdfs:label ?universeLabel .
                          ?type rdfs:label ?typeLabel .}
} GROUP BY ?char ?charName LIMIT 10
  `;

  static umlExampleData = `
<?xml version="1.0" encoding="UTF-8"?>
<uml:Model xmi:version="2.1" xmlns:xmi="http://schema.omg.org/spec/XMI/2.1" xmlns:uml="http://www.eclipse.org/uml2/3.0.0/UML"
 xmi:id="kzimxktg" name="ShExGeneratedXMI">
<packagedElement xmi:type="uml:Class" xmi:id="kzimxktm" name=":User">
	<ownedAttribute xmi:id="kzimxktn" name="schema:name" visibility="public" isUnique="false">
		<type xmi:type="uml:PrimitiveType" href="pathmap://UML_LIBRARIES/UMLPrimitiveTypes.library.uml#String">
		</type>
	</ownedAttribute>
	<ownedAttribute xmi:id="kzimxktp" name="schema:birthDate" visibility="public" isUnique="false">
		<type xmi:type="uml:PrimitiveType" href="pathmap://UML_LIBRARIES/UMLPrimitiveTypes.library.uml#Date">
		</type>
		<lowerValue xmi:type="uml:LiteralInteger" xmi:id="kzimxkto" />
	</ownedAttribute>
	<ownedAttribute xmi:type="uml:Property" xmi:id="kzimxktq" name="schema:gender" visibility="public" type="kzimxktr" isUnique="true">
	</ownedAttribute>
	<ownedAttribute xmi:id="kzimxktq" name="schema:gender" visibility="public" isUnique="false">
		<type xmi:type="uml:PrimitiveType" href="pathmap://UML_LIBRARIES/UMLPrimitiveTypes.library.uml#String">
		</type>
	</ownedAttribute>
	<ownedAttribute xmi:type="uml:Property" xmi:id="kzimxktu" name="schema:knows" visibility="public" type="kzimxktv" isUnique="true">
	</ownedAttribute>
	<ownedAttribute xmi:id="kzimxktx" name="schema:knows" visibility="public" type="kzimxktm" association="kzimxkty" ></ownedAttribute>
</packagedElement>
<packagedElement xmi:type="uml:Association" xmi:id="kzimxkty" memberEnd="kzimxktx kzimxktz">
	<ownedEnd xmi:id="kzimxktz" visibility="public" type="kzimxktm" association="kzimxkty"/>
</packagedElement>
<packagedElement xmi:type="uml:Enumeration" xmi:id="kzimxktl" name="Prefixes">
	<ownedLiteral xmi:id="kzimxkth" name="prefix : &lt;http://example.org/>"/>
	<ownedLiteral xmi:id="kzimxkti" name="prefix schema: &lt;http://schema.org/>"/>
	<ownedLiteral xmi:id="kzimxktj" name="prefix xsd: &lt;http://www.w3.org/2001/XMLSchema#>"/>
	<ownedLiteral xmi:id="kzimxktk" name="base &lt;http://example.org/>"/>
</packagedElement>
<packagedElement xmi:type="uml:Enumeration" xmi:id="kzimxktr" name="schema:gender">
	<ownedLiteral xmi:id="kzimxku0" name="schema:Male"/>
	<ownedLiteral xmi:id="kzimxku1" name="schema:Female"/>
</packagedElement>
<packagedElement xmi:type="uml:PrimitiveType" xmi:id="kzimxktv" name="IRI"/>
</uml:Model>
  `;
}

export default Examples;

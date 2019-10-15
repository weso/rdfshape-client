import React, {useState, useEffect} from 'react';
import PropTypes from "prop-types";
import {AsyncTypeahead, Typeahead, Token} from 'react-bootstrap-typeahead';
import API from "./API";
import 'react-bootstrap-typeahead/css/Typeahead.css';
import 'react-bootstrap-typeahead/css/Typeahead-bs4.min.css';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import SelectLanguage from "./SelectLanguage";
import InputGroup from "react-bootstrap/InputGroup";


const SEARCH_URI = API.wikidataSearchEntity ;
const PER_PAGE = 50;
const defaultLanguage = [{label: 'en', name:'English'}];

function InputEntitiesByText(props) {
    const [isLoading, setIsLoading] = useState(false);
    const [options, setOptions] = useState([]);
    const [selected, setSelected] = useState(props.entities);
    const [language,setLanguage] = useState(defaultLanguage);

    function makeAndHandleRequest(label, language, page = 0) {
        const lang = language[0] ? language[0].label : 'en' ;
        return fetch(`${SEARCH_URI}?label=${label}&limit=${PER_PAGE}&language=${lang}&continue=${page * PER_PAGE}`)
            .then((resp) => resp.json())
            .then((json) => {
                console.log(`Response for ${label}: ${JSON.stringify(json)}`)
                return json;
            });
    }


    function handleSearch(query) {
        setIsLoading(true);
        console.log(`before MakeAndHandleRequest: ${JSON.stringify(language)}`)
        makeAndHandleRequest(query, language, 0)
            .then((resp) => {
                console.log(`handleSearch, Response: ${JSON.stringify(resp)}`)
                setIsLoading(false);
                setOptions(resp);
            });
    }

    const MenuItem = ({item}) => (
        <div>
            <span>{item.id}</span><br/>
            <span>{item.label}</span><br/>
            <span><b>{item.descr}</b></span>
        </div>
    );

    function customRenderToken(option, props, index) {
        return (
            <Token
                key={index}
                onRemove={props.onRemove}>
                {`${option.id} (${option.label})`}
            </Token>
        );
    }

    return (
        <Container fuild={true}>
        {/*<Row>{JSON.stringify(language)}</Row>*/}
        <Row>
            <Col>
            <AsyncTypeahead
                filterBy={['id','label','descr']}
                labelKey="id"
                multiple
                isLoading={isLoading}
                options={options}
                maxResults = {10}
                paginate
                minLength={2}
                onSearch={handleSearch}
                renderToken={customRenderToken}
                placeholder="Search wikidata entity..."
                renderMenuItemChildren={(option, props) => (
                    <MenuItem key={option.id} item={option}/>
                )}
                useCache={false}
                selected={selected}
                onChange={(selected) => {
                    console.log(`Selected: ${JSON.stringify(selected)}`)
                    props.onChange(selected)
                    setSelected(selected)
                }}
            />
            </Col>
            <Col>
                <InputGroup>
                  <InputGroup.Prepend>
                    <InputGroup.Text id="basic-addon1">Language</InputGroup.Text>
                  </InputGroup.Prepend>
                  <SelectLanguage language={[{label:'en', name: 'English'}]} onChange={setLanguage} />
                </InputGroup>
            </Col>
        </Row>
        </Container>
  );
}

InputEntitiesByText.propTypes = {
    entities: PropTypes.array,
    onChange: PropTypes.func.isRequired,
};

export default InputEntitiesByText;

import axios from "axios";
import PropTypes from "prop-types";
import React, { useEffect, useState } from 'react';
import { Token, Typeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead-bs4.min.css';
import 'react-bootstrap-typeahead/css/Typeahead.css';

const defaultLanguage = {label: 'en', name:'English'};

function SelectLanguage(props) {
    const [options, setOptions] = useState([ ]);
    const [language,setLanguage] = useState(props.language);

    useEffect(() => {
        const fetchData = async () => {
            const LANGS_URI = process.env.REACT_APP_RDFSHAPE_HOST + "/api/wikidata/languages" ;
            const result = await axios.get(LANGS_URI);
            setOptions(result.data);
        };
        fetchData();
    }, [props.language]);

    const MenuItemLang = ({item}) => (
        <div>
            <span>{item.label}</span> <span><b>{item.name}</b></span>
        </div>
    );


    function customRenderToken(option, props, index) {
        return (
            <Token
                key={index}
                onRemove={props.onRemove}>
                {`${option.label} (${option.name})`}
            </Token>
        );
    }

    return (
       <Typeahead options={options}
                  renderToken={customRenderToken}
                  placeholder="Language"
                  renderMenuItemChildren={(option, props) => (
                        <MenuItemLang key={option.id} item={option}/>
                    )}
                    defaultSelected={[defaultLanguage]}
                    selected={language}
                    onChange={(lang) => {
                        props.onChange(lang)
                        setLanguage(lang)
                    }}
                />
  );
}

SelectLanguage.propTypes = {
    language: PropTypes.string,
    onChange: PropTypes.func.isRequired,
};

export default SelectLanguage;

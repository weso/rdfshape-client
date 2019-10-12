import React, {useState} from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Alert from 'react-bootstrap/Alert';
import {AsyncTypeahead} from 'react-bootstrap-typeahead';
import API from "../API";


const SEARCH_URI = API.wikidataSearchEntity ;
const PER_PAGE = 50;
const LANG='en'

function TestSearch(props) {
    const [isLoading, setIsLoading] = useState(false);
    const [options, setOptions] = useState([]);
    const [query, setQuery] = useState('');
    const [selected, setSelected] = useState(null);
    let _cache = {};


    function makeAndHandleRequest(label, language, page = 1) {
            return fetch(`${SEARCH_URI}?label=${label}&limit=${PER_PAGE}&language=${language}&continue=${page * PER_PAGE}`)
                .then((resp) => resp.json())
                .then((json) => {
                    console.log(`Response for ${label}: ${JSON.stringify(json)}`)
                    const options = json.search.map((i) => ({
                        id: i.id,
                        label: i.label,
                        descr: i.description,
                        uri: i.concepturi
                    }));
                    console.log(`Options: ${JSON.stringify(options)}`)
                    return options;
                });
        }

    function handleInputChange(query) {
            setQuery(query);
    }

    function handlePagination(e, shownResults) {
        const cachedQuery = _cache[query];

        // Don't make another request if:
        // - the cached results exceed the shown results
        // - we've already fetched all possible results
        if (cachedQuery.options.length > shownResults ||
            cachedQuery.options.length === cachedQuery.total_count
        ) {
            return;
        }

        setIsLoading( true);

        const page = cachedQuery.page + 1;

        makeAndHandleRequest(query, page)
            .then((resp) => {
                const options = cachedQuery.options.concat(resp.options);
                this._cache[query] = {...cachedQuery, options, page};
                this.setState({
                    isLoading: false,
                    options,
                });
            });
    }


    function handleSearch(query) {
            setIsLoading(true);
            makeAndHandleRequest(query, LANG)
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

    return (
        <Container fuild={true}>
            <h1>Select wikidata item</h1>
            <Row>
                <Col>
            <AsyncTypeahead
                query={query}
                multiple
                isLoading={isLoading}
                options={options}
                maxResults={PER_PAGE - 1}
                minLength={2}
                onInputChange={handleInputChange}
                onSearch={handleSearch}
                paginate
                placeholder="Search wikidata entity..."
                renderMenuItemChildren={(option, props) => (
                    <MenuItem key={option.id} item={option} />
                )}
                useCache={false}
                selected={selected}
                onChange={(selected) => setSelected(selected)}
            />
                </Col>
            </Row>
            <Row>
                <Col>
                { selected ?
                    <Alert variant="info">{JSON.stringify(selected)} </Alert> :
                    <Alert variant="danger" >No item selected </Alert>
                }
                </Col>
            </Row>
        </Container>
    );
}

export default TestSearch;
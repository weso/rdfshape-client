# RDFShape-client

This is the front-end part of the [rdfshape.weso.es](https://rdfshape.weso.es) tool.

This project is a pure client library implemented with [React](http://reactjs.org/) and bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

[![Continuous Integration](https://github.com/weso/rdfshape-client/actions/workflows/build_test.yml/badge.svg)](https://github.com/weso/rdfshape-client/actions/workflows/build_test.yml)



## Available Scripts

### `npm start`

Runs the app in the development mode with hot reloading after edits.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance (see [deployment](https://facebook.github.io/create-react-app/docs/deployment)).

## Docker
This React application can be launched as a Docker container.

* Use the provided Dockerfile to build rdfshape image.
* When building the Docker image, you may provide the following arguments
  via `--build-arg`:
    * [RDFSHAPE_HOST]: Location where this client will look for the rdfshape backend. Defaults to our current deployment at https://rdfshape.weso.es:8080.


# Contribution and issues

Contributions are greatly appreciated. Please fork this repository and open a pull request to add more features or submit issues:

* [Issues about RDFShape client](https://github.com/weso/rdfshape-client/issues)

<a href="https://github.com/weso/rdfshape-client/graphs/contributors">
  <img src="https://contributors-img.web.app/image?repo=weso/rdfshape-client" />
</a>

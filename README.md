# RDFShape-client

This is the front-end part of the [rdfshape.weso.es](http://rdfshape.weso.es) tool.

This project is a pure client library implemented with [React](http://reactjs.org/).
It was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

[![Build Status](https://travis-ci.org/weso/rdfshape-client.svg?branch=master)](https://travis-ci.org/weso/rdfshape-client)


## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Docker
This React application can be launched as a Docker container.

* Use the provided Dockerfile to build rdfshape image.
* When building the Docker image, you may provide the following arguments
  via `--build-arg`:
    * [RDFSHAPE_HOST]: Location where this client will look for the rdfshape backend. Defaults to our current deployment at https://rdfshape.weso.es:8080.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

# Contribution and issues

Contributions are greatly appreciated. Please fork this repository and open a pull request to add more features or submit issues:

* [Issues about RDFShape client](https://github.com/weso/rdfshape-client/issues)

<a href="https://github.com/weso/rdfshape-client/graphs/contributors">
  <img src="https://contributors-img.web.app/image?repo=weso/rdfshape-client" />
</a>

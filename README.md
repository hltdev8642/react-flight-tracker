<div style="text-align: center;">
    <h1><b>React Flight Tracker</b></h1>
    <img src='readme-assets/flightTracker.png' width='250' height='250'  alt="flightTracker"/>
    <p>3D Visualization of Flight Data using React and Three.js</p>

![license](https://img.shields.io/badge/license-MIT-blue.svg)
![pipeline status](https://gitlab.com/dev6645326/react-flight-tracker/badges/master/pipeline.svg?ignore_skipped=true)
![release](https://gitlab.com/dev6645326/react-flight-tracker/-/badges/release.svg)
![coverage](https://gitlab.com/dev6645326/react-flight-tracker/badges/master/coverage.svg)

</div>

## Table of Contents

- [About](#about)
- [Technologies](#technologies)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## About

This project is a 3D visualization of flight data using React and Three.js.
The data is provided by the FlightRadar24 API using the
library [flightradar24-client-ts](https://www.npmjs.com/package/flightradar24-client-ts).

The project is deployed on kubernetes using flux CD.
The CI/CD pipeline is managed by Gitlab CI/CD and updates are automatically deployed to the
dev([develop branch](https://gitlab.com/dev6645326/react-flight-tracker/-/tree/develop)) and
prod([master branch](https://gitlab.com/dev6645326/react-flight-tracker/-/tree/master)) environments.

The dev environment is deployed
at [https://react-flight-tracker.dev.apoorva64.com/](https://react-flight-tracker.dev.apoorva64.com/).
The prod environment is deployed
at [https://react-flight-tracker.apoorva64.com/](https://react-flight-tracker.apoorva64.com/).

## Technologies

![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript)
![TypeScript](https://img.shields.io/badge/typescript-%23323330.svg?style=for-the-badge&logo=typescript)
![React](https://img.shields.io/badge/react-%23323330.svg?style=for-the-badge&logo=react)
![Three.js](https://img.shields.io/badge/three.js-%23323330.svg?style=for-the-badge&logo=three.js)
![Docker](https://img.shields.io/badge/docker-%23323330.svg?style=for-the-badge&logo=docker)
![Kubernetes](https://img.shields.io/badge/kubernetes-%23323330.svg?style=for-the-badge&logo=kubernetes)
![Flux CD](https://img.shields.io/badge/fluxcd-%23323330.svg?style=for-the-badge&logo=fluxcd&logoColor=%23F7DF1E)
![Gitlab CI/CD](https://img.shields.io/badge/gitlabci-%23323330.svg?style=for-the-badge&logo=gitlabci)
![Conventional Commits](https://img.shields.io/badge/conventional%20commits-%23323330.svg?style=for-the-badge&logo=conventionalcommits)
![Semantic Release](https://img.shields.io/badge/semantic%20release-%23323330.svg?style=for-the-badge&logo=semanticrelease)
![ESLint](https://img.shields.io/badge/eslint-%23323330.svg?style=for-the-badge&logo=eslint)

## Getting Started

### Prerequisites

- Node.js
- npm
- Docker

### Installation

1. Clone the repo

```sh
git clone https://gitlab.com/dev6645326/react-flight-tracker.git
```

2. Install NPM packages

```sh
yarn
```

3. Start the development server

```sh
yarn dev
```

## Usage

### Flight Visualization

Click on a plane to view its flight path. The flight path is displayed as a line connecting the plane's current position
to its start position.
The JSON data is displayed in the menu on the left.
![jsonData](readme-assets/jsonData.png)

### Filter Flights

#### Filter flights by datasource

<img src="readme-assets/filterByDatasource.png" alt="filterByDatasource" height="250"/>

#### Filter flights by airport, airline

<img src="readme-assets/filterByAirportAirline.png" alt="filterByAirportAirline" width="250"/>

#### Graphics Settings

<img src="readme-assets/graphicSettings.png" alt="graphicSettings" height="250"/>

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create.
Any contributions you make are **greatly appreciated**.

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Contact

[<img alt="Github" src="https://img.shields.io/badge/Apoorva64-%23181717.svg?style=for-the-badge&logo=github&logoColor=white" />](https://github.com/Apoorva64)
[<img alt="Gitlab" src="https://img.shields.io/badge/Apoorva64-%23181717.svg?style=for-the-badge&logo=gitlab&logoColor=white" />](https://gitlab.com/Apoorva64)
[<img alt="LinkedIn" src="https://img.shields.io/badge/Apoorva Srinivas Appadoo-%23181717.svg?style=for-the-badge&logo=linkedin&logoColor=white" />](https://www.linkedin.com/in/appadoo-apoorva-srinivas-481367207/)

## Acknowledgements
- [Great Tutorial on calculating the position of astral objects](https://stjarnhimlen.se/comp/tutorial.html)
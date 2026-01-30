# cmms-apis

## Overview

This repository is responsible for cmms-apis usage.

### Primary Framework / Libraries /Tools

- NestJS Framework
- NPM packages
- Nest (optional)

## Appilcation configuration

    All the application configuration setting needs to be update in ```config.json```, its the default configuration

## How to Run

    Clone this repository
    Make sure you are using npm
    You can build the project by running ``` nest build``` or ``` npm run build```
    Once successfully built, you can run the service by one of these two methods:

### Method 1

    ```
    npm install
    npm run-script build
    npm start

    ```

### Method 2

    Make sure you have config.json file path

    ```
    npm intall
    nest build
    nest start -- "/home/example/config.json"
    ```
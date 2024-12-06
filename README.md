# COMP 3512 - F1 Single-Page App Project

## Overview
This repository contains the code for Assignment #2 for COMP 3512 at Mount Royal University. The objective is to develop a **Single-Page Application (SPA)** that allows users to view Formula 1 (F1) race data. This JavaScript-based project emphasizes interactive and efficient handling of data, leveraging local storage and a provided F1 API for dynamic content rendering.

The project focuses on creating a responsive and user-friendly application, incorporating views for home, races, and popups for detailed information about drivers, constructors, and circuits. 

## Hosting 
The project is hosted on **GitHub Pages**. You can access the live app [here](https://ttiff.github.io/comp3512-assignment2/).

## Features 
- Home View: Select a season to fetch and display race data, switching to the Races View.
- Race View: View all races for the selected season, sorted by rounds. Users can explore detailed qualifying and race results with sorting functionality.
- Driver, Constructor, and Circuit Popups: Access additional information about drivers, constructors, and circuits in modal-style popups. Users can add items to their favorites list and view indicators for favorited items in the Races View.
- Favourites Management: Track and store favorite drivers, constructors, and circuits.
- Local Storage Integration: Store fetched data locally to optimize performance and reduce server load.

## Technologies Used
- HTML, CSS, JavaScript, Semantic UI

## Main Project Files
- index.html: The main entry point of the application, serving as the backbone of the user interface. It provides the structure and layout for the webpage.
- browseView.js: Responsible for rendering the browse view of the application, specifically the race grid and associated dynamic elements.
- dataUtils.js: Handles data operations, including fetching, storing, and processing data from external APIs.
- popupUtils.js: Handles the creation and interaction of pop-ups for displaying detailed information about circuits, drivers, and constructors.
- tableUtils.js: Handles the creation and rendering of tables for displaying detailed race, qualifying, and driver statistics.
- domUtils.js: Handles creating and manipulating DOM elements.
- utils.js: Contains shared funcations used across the SPA.
- script.js: Serves as the central controller that ties together all other modules and initializes the application.
- style_browse.css: Dedicated stylesheet for the browse view.
- style_index.css:Dedicated style sheet for the home view. 
  
## API Routes
> **Note:** I did not create these API routes. They are provided as part of the assignment instructions.

### Base URL
- `https://www.randyconnolly.com/funwebdev/3rd/api/f1`

### Circuits

- `/circuits.php`: Returns all circuits. *(Not used in the project)*  
- `/circuits.php?id=1`: Returns single circuit specified by `circuitId` value.  *(Not used in the project)*  
 
### Constructors
- `/constructors.php`: Returns all constructors. *(Not used in the project)* 
- `/constructors.php?ref=mclaren`: Returns single constructor specified by `constructorRef` value.  *(Used to display detailed constructor information in the Constructor Popup)*
- `/constructorsResults.php?constructor=mclaren&season=2023`: Returns the race results by `constructorRef` and `season`. *(Not used in the project)*

### Drivers
- `/drivers.php`: Returns all drivers. *(Not used in the project)*  
- `/drivers.php?id=857`: Returns a single driver by `driverId`. *(Used to display detailed driver information in the Driver Popup)* 
- `/drivers.php?ref=piastre`: Returns a single driver by `driverRef`.  *(Not used in the project)*  
- `/driverResults.php?driver=pastri&season=2023`: Returns single driver specified by `driverRef` and `season`. *(Not used in the project)*  

### Races
- `/races.php?season=2023`: Returns all races for a specified `season`.   *(Used to fetch race data for the selected season and populate the Races View)* 
- `/races.php?id=1100`: Returns the specified race by `raceId`  *(Not used in the project)*  

### Results
- `/results.php?race=1100`: Returns race results for a specified race by `raceId`. *(Not used in the project)*  
- `/results.php?season=2023`: Returns race results for a specified `season`.  *(Used to display race results in the Races View)*

### Qualifying
- `/qualifying.php?race=1100`: Returns qualifying results for a specified race by `raceId`. *(Not used in the project)*  
- `/qualifying.php?season=2023`:  Returns qualifying race results for a specified `season`.   *(Used to display qualifying results for the selected season in the Races View)*

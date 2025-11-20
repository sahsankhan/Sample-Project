Prerequisites

Before you start, make sure you have the following installed:
•	Node.js: Version 16.0 or higher
•	npm: Version 7.0 or higher (comes with Node.js)
•	Modern Browser: Chrome, Firefox, Safari, or Edge (for viewing test reports)

Step 1: Install Dependencies
Open a terminal, navigate to your project directory, and run:
•	cd Sample-Project
•	npm install

This will install:
•	All production dependencies (React, Material-UI, etc.)
•	All testing dependencies (Vitest, Testing Library, etc.)
•	Development tools and build dependencies

Step 2: Verify Installation
Run tests to ensure everything is installed correctly:
•	npm run test:run

To generate a coverage report with a UI:
•	npm run test:ui

To view the coverage report in your browser:
•	start TEST_REPORT.html

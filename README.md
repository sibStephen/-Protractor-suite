# -Protractor-suite

This repository mainly contains the content of a Protractor suite(The pattern and code).

In order to install protractor along with the Report library type the following commands-

`npm install karma`

`npm install karma-chrome-launcher` (Chrome specific)

`npm install karma-jasmine`

`npm install protractor-jasmine2-screenshot-reporte` (For Reports)

`Need to update the web-driver manager because it's the back end server where in the request passes through the selenium driver
Type the command below`

`./node_modules/protractor/bin/webdriver-manager update`

After which run `protractor conf.js` (From the base directory where conf.js file is kept).

This will run the protractor script(File named - checklist-spec.js in checklist folder) mentioned in conf.js file.

Happy Testing :)

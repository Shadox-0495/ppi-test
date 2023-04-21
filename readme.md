# ppi coding test.

This project uses the webpack to bundle the code and third party libraries and uses a php api that is hosted using [000Webhost](https://www.000webhost.com/).

[Live demo](https://transcendent-torrone-30660c.netlify.app)

![alt text](https://github.com/Shadox-0495/ppi-test/blob/master/img/cover.png?raw=true)

Open the project folder and install the dependencies using:

```sh
npm i
```

To run the project in development enviroment run the command:

```sh
npm start
```

To build the project for production run the command:

```sh
npm run build
```

The api runs in a PHP server and uses a MySQL database, in order to run the api in your local machine copy all the contents from the api folder into the php server (any version) and modify the <kbd>connection.php</kbd> file, you may also need to install/enable the pdo driver in the php server.

You can change the project's api reference modifying the <kbd>API_URL</kbd> variable located in the <kbd>.env</kbd> files, there is one for development (<kbd>.env.dev</kbd>) and another for production (<kbd>.env.prod</kbd>).

# Test requirements:

### 1) A way to enter Candidate information into the system. Candidate information should be validated.

Candidate information includes

-   First Name
-   Last Name
-   Email Address
-   Phone Number
-   Residential Zip Code

### 2) Search Candidates. This should provide the ability to search the candidates entered in Step 1 and present the results to the end user in a grid or some other manner - presentation is up to you. Search criteria shouldsupport:

-   First Name
-   Last Name
-   Email Address
-   Phone Number
-   Residential Zip Code

### 3) Pre-population of Candidates

-   To help both YOU and US verify your work and verify that search works, pre-populate
    some candidates with various properties. This can be done within the code / in memory for
    this exercise, in order to save time.

### Additional Notes:

-   Bonus points will be given for the ability to search multiple candidate areas, such as zip code and first name for example.
-   No storage of the User Candidates via File System or SQL is required for this exercise
-   Bonus points for any SQL / File System storage of date.
-   No login is required for this exercise.
-   Anyone can access the site and get to the Candidate Entry / Search functions.
-   You can use any Third Party libraries you would like.

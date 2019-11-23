const fs = require("fs");
const axios = require("axios");
const inquirer = require("inquirer");
const util = require("util");

const expotfile = require("./exportFile");
const puppeteer = require("puppeteer");
const writeFileAsync = util.promisify(fs.writeFile);

function rendergithubURL() {
    inquirer
        .prompt({
            type: "input",
            message: "Enter your GitHub username:",
            name: "username",

        })
        .then(function ({ username }) {
            const config = { headers: { accept: "application/json" } };
            const queryUrl = `https://api.github.com/users/${username}`;

            return axios.get(queryUrl, config).then(userinformation => {
                let queryurlnew = `https://api.github.com/users/${username}/starred`;

                axios.get(queryurlnew, config).then(represtory => {
                  const  data = {
                        //getting all information from github url and add in onject data
                        img: userinformation.data.avatar_url, location: userinformation.data.location,
                        gitProfile: userinformation.data.html_url, userBlog: userinformation.data.blog,
                        userBio: userinformation.data.bio, repoNum: userinformation.data.public_repos,
                        followers: userinformation.data.followers, following: userinformation.data.following,
                        starNum: represtory.data.length, username: username

                    };
                    // call function 
                    expotfile( data) ;
                    xe( expotfile( data) );

                    createPdf (username);
                });

            });
        });
}

//   call back function to create HTML file 

const xe = function expotfile(){
    writeFileAsync("index.html", expotfile);
}



rendergithubURL();

async function createPdf(username) {
    try {

        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        console.log("true");

        await page.goto("file://C:/Users/meysa/first_day_stuff/nodehm/index.html");
        await page.emulateMediaFeatures('screen');
        await page.pdf({
            path: `${username}.pdf`,
            format: `A4`,
            displayHeaderFooter: true,
            printBackground: true,
            landscape: true

        })
    }
    catch (err) {
        console.log("err");

    }
}
const util = require("util");
const puppeteer = require("puppeteer");
const fs = require("fs");
const axios = require("axios");
const inquirer = require("inquirer");

const expotfile = require("./exportFile");

const writeFileAsync = util.promisify(fs.writeFile);

function rendergithubURL() {
  inquirer
    .prompt([
      {
        type: "input",
        message: "Enter your GitHub username",
        name: "username"
      }
    ])
    .then(function ({ username }) {
       //const config = { headers: { accept: "application/json" } };
      let queryUrl = ` https://api.github.com/users/${username}`;
      return axios.get(queryUrl ).then(userinformation => {
        let queryurlnew = `https://api.github.com/users/${username}/starred`;

      return  axios.get(queryurlnew).then(represtory => {
          data = {
            //getting all information from github and add in onject data
            img: userinformation.data.avatar_url, location: userinformation.data.location,
            gitProfile: userinformation.data.html_url, userBlog: userinformation.data.blog,
            userBio: userinformation.data.bio, repoNum: userinformation.data.public_repos,
            followers: userinformation.data.followers, following: userinformation.data.following,
            starNum: represtory.data.length, username: username

          };
          // call function 
          expotfile(data);
          writeHTMLfile(expotfile(data));
          createPdf(username);


        });
      });
    });
}
rendergithubURL();
// creat call back function to create HTML file 
  const writeHTMLfile =  expotfile => {
  writeFileAsync("index.html", expotfile);

}


async function createPdf(username) {
  
    console.log("true");
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.emulateMedia('print');
    await page.goto("file://C:/Users/meysa/Desktop/testhomework/node/index.html");

    //To generate a pdf  name and format
     
    await page.pdf({ path:`GeneratePDF.pdf`,format: `A4` , printBackground: true});
    await browser.close();
}

  


  
  



 
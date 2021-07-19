import articleScrapper from "./articleScrapper";

const URL = require("url").URL;

async function main() {

    const isCorrectNumArgs = process.argv.length < 6 && process.argv.length >= 3;
    console.log(process.argv.length)
    if (!isCorrectNumArgs) {

        console.log("Please re-run with correct number of arguments!");

    } else {

        const url = process.argv[2];
        const authorName = process.argv[3];

        const isValid = stringIsAValidUrl(url);

        if (isValid){
            //Run the web scraping program
            await articleScrapper(url, authorName)
        } else{
            console.log("Invalid Web article URL")
        }
    }
}

main();

function stringIsAValidUrl(s) {
    try {
        new URL(s);
        return true;
    } catch (err) {
        return false;
    }
};

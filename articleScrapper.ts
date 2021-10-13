const puppeteer = require('puppeteer');
// const spirolinaLogo = require('../server/logos/spirolinaLogo.png')
// const allinLogo = require('../server/logos/allinLogo.png')

export default async (articleUrl: string, authorName: string) => {
    // runPuppeteer(articleUrl)
    scrap(articleUrl, authorName);
}
async function scrap(url: string, authorName: string) {
    // Launch the browser
    const browser = await puppeteer.launch();
    // Create an instance of the page
    const page = await browser.newPage();
    // Go to the web page that we want to scrap
    await page.goto(url);
    const result = []
    page.on('console', consoleObj => console.log(consoleObj.text()));
    const data = await page.evaluate((result, authorName) => {
        const title = document.querySelector(authorName === 'allin'?
            'div.singletext > div.stbold > p > span': 'h1'
        ).textContent;
        const image = document.querySelector(
            authorName === 'allin' ? 'div.singletext > div.sttop > p:nth-child(1) > img' : 'div.info-page-header  >  img'
        ).getAttribute('src');

        const mainDiv = document.querySelector(authorName === 'allin' ? 'div.singletext > div.sttop': '.info-page-description')
        const children = Array.from(mainDiv.children);

        children.forEach(child => {
            let obj = {
                type: '',
                elementContent: undefined,
            }
            const isList = child.localName === 'ul' || child.localName === 'ol' || child.localName === 'dl';

            if (isList) {
                const listChildren = Array.from(child.children);
                const listItems = []
                listChildren.forEach(child => {
                    listItems.push(child.textContent)
                })
                obj.type = child.localName;
                obj.elementContent = listItems;
                result.push(obj)
            } else {
                const isImage = child.querySelector('img') !== null;

                if(!isImage && child.textContent && child.textContent.length > 1){
                    obj.type = child.localName;
                    obj.elementContent = child.textContent;
                    result.push(obj)
                }
            }
        })

        return {authorName, title, image, body:result, hasBeenScraped: true}
    }, result, authorName)
    // We close the browser
    await browser.close();
    return data;
}

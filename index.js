const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const { exit } = require('process');

// Accepts an additional argument for format selection
const [url, outputFile, format] = process.argv.slice(2);

if (!url) {
    throw 'Please provide a URL as the first argument.';
}

function sanitizeFileName(boardTitle) {
    return boardTitle.replace(/\s+/g, '');
}

async function run() {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.goto(url);
    await page.waitForSelector('.easy-card-list');
    const boardTitle = await page.$eval('.board-name', (node) => node.innerText.trim());

    if (!boardTitle) {
        throw 'Board title does not exist. Please check if provided URL is correct.';
    }

    const columns = await page.$$('.easy-card-list');
    let content = format === 'format2' ? `"${sanitizeFileName(boardTitle)}"\n` : boardTitle + '\n\n';

    for (let i = 0; i < columns.length; i++) {
        const columnTitle = await columns[i].$eval('.column-header', (node) => node.innerText.trim());
        let columnData = format === 'format2' ? `"${columnTitle}"` : columnTitle + '\n';

        const messages = await columns[i].$$('.easy-board-front');
        for (let j = 0; j < messages.length; j++) {
            const messageText = await messages[j].$eval('.easy-card-main .easy-card-main-content .text', (node) => node.innerText.trim());
            const votes = await messages[j].$eval('.easy-card-votes-container .easy-badge-votes', (node) => parseInt(node.innerText.trim(), 10));

            if (votes >= 1) {
                const itemContent = format === 'format2' ? `,"${messageText} (${votes})"` : `- ${messageText} (${votes})` + '\n';
                columnData += itemContent;
            }
        }

        content += columnData + (format === 'format2' ? '\n' : '\n\n');
    }


    return content;
}

function writeToFile(filePath, data) {
    const extension = format === 'format2' ? '.csv' : '.txt';
    const resolvedPath = path.resolve(filePath || `../${sanitizeFileName(data.split('\n')[0].replace('/', ''))}${extension}`);
    fs.writeFile(resolvedPath, data, (error) => {
        if (error) {
            throw error;
        } else {
            console.log(`Successfully written to file at: ${resolvedPath}`);
        }
        exit();
    });
}

function handleError(error) {
    console.error(error);
}

run().then((data) => writeToFile(outputFile, data)).catch(handleError);

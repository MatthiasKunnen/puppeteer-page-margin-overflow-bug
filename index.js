const puppeteer = require('puppeteer');
const fs = require('fs');

async function generatePdf() {
    const browser = await puppeteer.launch({
        headless: true,
    });
    const html = await fs.promises.readFile('./index.html', 'utf-8')
    const page = await browser.newPage();
    await page.setContent(html);

    const pdf = await page.pdf({
        format: 'A4',
        printBackground: true,
    });
    await browser.close();

    await fs.promises.writeFile('./out.pdf', pdf)
    console.log(`${new Date().toISOString()}: Generated PDF`)
}

generatePdf().catch(error => {
    console.error('Failed to generate PDF', error)
})

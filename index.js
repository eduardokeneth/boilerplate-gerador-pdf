const puppeteer = require('puppeteer')
const fs = require('fs-extra')
const hbs = require('handlebars')
const path = require('path')
const moment = require('moment')

const data = require('./database.json')

const compile = async function(pdfName, data) {
    const filePath = path.join(process.cwd(), 'templates', `${pdfName}.hbs`)
    const html = await fs.readFile(filePath, 'utf-8')
    return hbs.compile(html)(data);
}

hbs.registerHelper('dateFormat', function(value, format){
    console.log('formating', value, format)
    return moment(value).format(format)
})

const generator = async () => {
    
    const pdfParams = {
        path: 'gerado.pdf',
        format: 'A4',
        printBackground: true,
    }

    try {
     
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
    
        const content = await compile('template', data)

        await page.setContent(content)
        await page.emulateMedia('screen');
        await page.pdf(pdfParams)
    
        await browser.close();
        process.exit();
    
        } catch (error) {
            console.log(error)
        }
}

generator()
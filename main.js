import puppeteer from "puppeteer"
import fs from "fs/promises"

async function handleDynamicWebPage() {
    const browser = await puppeteer.launch({
        headless: false,
        slowMo: 200,
    })
    const page = await browser.newPage()
    await page.goto("https://quotes.toscrape.com")
    //   await page.waitForSelector('div[data-loaded="true"]'); // reemplazar esto con el selector de CSS correcto.
    const data = await page.evaluate(() => {
        const quotes = document.querySelectorAll(".quote")
        const data = [...quotes].map((quote) => {
            const quoteText = quote.querySelector(".text").innerText
            const author = quote.querySelector(".author").innerText
            const tags = [...quote.querySelectorAll(".tag")].map(
                (tag) => tag.innerText
            )
            return {
                quoteText,
                author,
                tags,
            }
        })
        return data
    })
    console.log(data)

    fs.writeFile("quotes.json", JSON.stringify(data))

    await browser.close()
}

handleDynamicWebPage()
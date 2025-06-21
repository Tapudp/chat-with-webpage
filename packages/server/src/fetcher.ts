import axios from 'axios'
import { load } from 'cheerio'

export async function fetchPageContent(url: string): Promise<string> {
    const response = await axios.get(url, {
        headers: {
            'User-Agent': 'Mozilla/5.0'
        }
    })

    const $ = load(response.data)

    // Clean up the content
    $('script, style, nav, footer, iframe').remove()

    // Get clean text
    return $('body').text()
        .replace(/\s+/g, ' ')
        .replace(/[\n\r]+/g, '\n')
        .trim()
}
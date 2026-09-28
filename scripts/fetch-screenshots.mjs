import fs from 'fs'
import path from 'path'
import https from 'https'
import http from 'http'

const projects = [
  { id: 'top10', url: 'https://toptenmarketingagencyeg.com/' },
  { id: 'skillup', url: 'https://darkgray-rail-102571.hostingersite.com/' },
  { id: 'bookhaven', url: 'https://darkblue-loris-236391.hostingersite.com/' },
  { id: 'smile-art', url: 'https://royalblue-cobra-452071.hostingersite.com/' },
  { id: 'graphic-portfolio', url: 'https://magenta-wren-994288.hostingersite.com/' },
  { id: 'visit-egypt', url: 'https://ghostwhite-lapwing-131800.hostingersite.com/' },
  { id: 'furniture', url: 'https://powderblue-hamster-445284.hostingersite.com/' },
  { id: 'personal-portfolio', url: 'https://white-sardine-555455.hostingersite.com/' },
  { id: 'wordpress-lms', url: 'https://nagyelghiety.com/' },
]

const outputDir = path.resolve('public/projects')
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true })
}

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest)
    const client = url.startsWith('https') ? https : http
    client.get(url, (response) => {
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        return downloadFile(response.headers.location, dest).then(resolve).catch(reject)
      }
      if (response.statusCode !== 200) {
        return reject(new Error(`Failed with status code: ${response.statusCode}`))
      }
      response.pipe(file)
      file.on('finish', () => {
        file.close(() => resolve(dest))
      })
    }).on('error', (err) => {
      fs.unlink(dest, () => {})
      reject(err)
    })
  })
}

async function fetchScreenshot(p) {
  const destPath = path.join(outputDir, `${p.id}.png`)
  console.log(`[Fetching] ${p.id} from ${p.url}...`)

  try {
    // 1. Try thum.io direct screenshot service (fast, reliable)
    const thumUrl = `https://image.thum.io/get/width/1200/crop/800/noanimate/${p.url}`
    await downloadFile(thumUrl, destPath)
    const stat = fs.statSync(destPath)
    if (stat.size > 5000) {
      console.log(`[Success] Saved ${p.id}.png (${Math.round(stat.size / 1024)} KB) via Thum.io`)
      return
    }
  } catch (err) {
    console.log(`[Thum.io failed for ${p.id}]:`, err.message)
  }

  try {
    // 2. Try Microlink
    const apiUrl = `https://api.microlink.io/?url=${encodeURIComponent(p.url)}&screenshot=true`
    const res = await fetch(apiUrl)
    const json = await res.json()
    if (json.status === 'success' && json.data?.screenshot?.url) {
      await downloadFile(json.data.screenshot.url, destPath)
      console.log(`[Success] Saved ${p.id}.png via Microlink`)
      return
    }
  } catch (err) {
    console.log(`[Microlink failed for ${p.id}]:`, err.message)
  }
}

async function main() {
  for (const p of projects) {
    await fetchScreenshot(p)
  }
  console.log('All screenshots processed!')
}

main()

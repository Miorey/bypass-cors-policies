const express = require(`express`)
const morgan = require(`morgan`)
const fsPromises = require(`fs`).promises
const fs = require(`fs`)
const path = require(`path`)
const cors = require(`cors`)
require(`dotenv`).config()

const app = express()
const PORT = process.env.PORT ?? 3000
const TIMEOUT = process.env.TIMEOUT ?? 2000
const SERVER_NAME = process.env.SERVER_NAME

const fetch = require(`node-fetch`)

// Setup logging
app.use(morgan(`dev`))

// To handle body parsing
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const storageDir = path.join(__dirname, `storage`)
if (!fs.existsSync(storageDir)) {
    fs.mkdirSync(storageDir)
}

app.use(cors())

async function createFile(req)  {
    console.log(`${SERVER_NAME}${req.url}`)
    const localFilePath = path.join(storageDir, encodeURIComponent(req.url))
    const timeout = new Promise((_, reject) => {
        setTimeout(() => {
            reject(new Error(`Request timed out after ${TIMEOUT} milli-seconds`))
        }, TIMEOUT)
    })

    const response = await Promise.race([
        fetch(`${SERVER_NAME}${req.url}`),
        timeout
    ]).catch(() => {
        return {ok: false, status: 408}
    })
    if (!response.ok) {
        return response.status
    }
    const buffer = await response.arrayBuffer()
    await fsPromises.writeFile(localFilePath, Buffer.from(buffer))
    return false
}

app.use(`/`, async (req, res, next) => {
    const localFilePath = path.join(storageDir, encodeURIComponent(req.url))
    if (!fs.existsSync(localFilePath)){
        const err = await createFile(req)
        if (err){
            console.warn(`Error ${err} on ${SERVER_NAME}${req.url}`)
            res.status(err)
            return next(err)
        }
    }
    // Respond with the file
    res.sendFile(localFilePath)
})

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})

import express from 'express'
import morgan from 'morgan'
import { promises as fsPromises, existsSync } from 'fs'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'
import cors from 'cors'
import dotenv from 'dotenv'
import fetch from 'node-fetch'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
const PORT = process.env.PORT ?? 3000
const TIMEOUT = process.env.TIMEOUT ?? 2000
const SERVER_NAME = process.env.SERVER_NAME


// Setup logging
app.use(morgan(`dev`))

// To handle body parsing
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const storageDir = path.join(__dirname, `storage`)
if (!existsSync(storageDir)) {
    fsPromises.mkdir(storageDir, { recursive: true }).catch(console.error)
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
    if (!existsSync(localFilePath)) {
        const err = await createFile(req)
        if (err) {
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

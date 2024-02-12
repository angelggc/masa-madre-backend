import { Router } from "express";
import { readdirSync } from 'fs'

const PATH_ROUTER = `${__dirname}`

const router = Router()


const clearFileName = (filename: string) => {
    const file = filename.split('.').shift()
    return file
}
readdirSync(PATH_ROUTER).filter((filename) => {
    const cleanName = clearFileName(filename);
    if (cleanName !== "index") {
        import(`./${cleanName}`).then((moduleRouter) => {
            console.log(`File import and loaded: ${cleanName}`)
            router.use(`/api/v1/${cleanName}`, moduleRouter.router)
        })
    }
})

export { router }
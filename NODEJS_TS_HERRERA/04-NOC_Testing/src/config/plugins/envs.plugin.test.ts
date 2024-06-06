import { envs } from "./envs.plugin"

describe("envs.plugin.ts test", ()=>{


    test("should return env options",()=>{
        expect(envs).toEqual( {
            PORT: 3000,
            MAILER_EMAIL: 'ismael@gmail.com',
            MAILER_SERVICE: 'gmail',
            MAILER_SECRET_KEY: '12341234',
            PROD: false,
            MONGO_STRING: 'mongodb://localhost:27017',
            MONGO_DB: 'NOC_TEST'
          })
    
    })

    test("should return error if not found env", async()=>{
        jest.resetModules() //reseteo
        process.env.PORT = "ABC" //pongo otro puerto

        try {
            await import('./envs.plugin')
            expect(true).toBe(false)

            
        } catch (error) {
          expect(`${error}`).toContain('env-var: "PORT" should be a valid integer') //le paso el error como string en un template literal
        }
    })
})
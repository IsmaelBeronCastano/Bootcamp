import { characters } from "../../js-foundation/02-destructuring";


describe("js-foundation/02-destructuring.ts", ()=>{
    test("characters should contain Flash", ()=>{

        //debe contener Flash
        expect(characters).toContain('Flash')
    })

    test("Flash should be the first character", ()=>{

        //el primero debe ser Flash y el segundo Superman
        const [flash, superman] = characters
        expect(flash).toBe('Flash')
        expect(superman).toBe('Superman')

    })
})


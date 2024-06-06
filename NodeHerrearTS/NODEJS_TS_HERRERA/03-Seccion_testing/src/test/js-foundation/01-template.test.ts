import { emailTemplate } from "../../js-foundation/01-template"

describe("js-foundation/01-template.ts", ()=>{

    test('emailTemplate should contain a greeting', ()=>{
        
        //Evalúo que tenga la palabra Hi
        expect(emailTemplate).toContain('Hi, ')
    })

    test('emailTemplate should contain {{name}} and {{orderId}} ', ()=>{
        
        //uso una expresión regular
        expect(emailTemplate).toMatch(/{{name}}/)
        expect(emailTemplate).toMatch(/{{orderId}}/)
    })
})
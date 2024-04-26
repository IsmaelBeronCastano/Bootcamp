import { getAge } from "../../plugins"

describe("get-age.plugin", ()=>{

    test('getAge() should return the age of a person', ()=>{

        const birthDate = '1981-06-30'

        const age = getAge(birthDate)

        expect(age).toBe(43)
    })
    
    test('getAge should return current age', ()=>{
        
        const birthDate = '1981-06-30'

        const age = getAge(birthDate)

        const calculatedAge = new Date().getFullYear() - new Date(birthDate).getFullYear();

        expect(age).toBe(calculatedAge)
    })

    test('getAge() should return 0 years', ()=>{
        const spy = jest.spyOn(Date.prototype, 'getFullYear').mockReturnValue(1995)

        const birthdate = '1995-01-01'

        const age = getAge(birthdate)

        expect(age).toBe(0)
        expect(spy).toHaveBeenCalled()
        //expect(spy).toHaveBeenCalledWith() serviría para indicar que getFullyear fue llamado con algún argumento
        
    })
})
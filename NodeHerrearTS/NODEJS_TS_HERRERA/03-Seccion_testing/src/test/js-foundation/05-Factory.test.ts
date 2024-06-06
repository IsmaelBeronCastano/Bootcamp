import { buildMakePerson } from "../../js-foundation/05-factory";

describe('Factory', () => {

    const getUUID = ()=>'1234'
    const getAge= ()=> 35

    test('buildMakePerson should return a function', () => {

    const makePerson = buildMakePerson({getUUID, getAge})        

    expect(typeof makePerson).toBe('function')
    })

    test('Should return a person', ()=>{

        const makePerson= buildMakePerson({getUUID, getAge}) //pruebo también la inyección de la dependencia getUUID y getAge             
        const JohnDoe= makePerson({name:'John Doe', birthdate: '1985-10-21'})
        
        //console.log(JohnDoe)
        
        expect(JohnDoe).toEqual({
            id:'1234',
            name:'John Doe',
            birthdate:'1985-10-21',
            age:35
        })  
    })
})
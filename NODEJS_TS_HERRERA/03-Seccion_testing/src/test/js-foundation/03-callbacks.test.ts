import { getUserById } from "../../js-foundation/03-callbacks"



describe("js-foundation/03-callbacks.ts", ()=>{
    test("getuserById should return an error if user does not exists", ()=>{
        const id = 10
                        //TS no me obliga a especificarlos porque ambos pueden ser nulos
        getUserById(id, (err, user)=>{
            expect(err).toBe(`User not found with id ${id}`)
            expect(user).toBe(undefined)
        })
    })

    test("", ()=>{
        
    })
})
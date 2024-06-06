import { getUserById } from "../../js-foundation/03-callbacks"



describe("js-foundation/03-callbacks.ts", ()=>{                         //uso del done para el callback
    test("getuserById should return an error if user does not exists", (done)=>{
        const id = 10
                        //TS no me obliga a especificarlos porque ambos pueden ser nulos
        getUserById(id, (err, user)=>{
            expect(err).toBe(`User not found with id ${id}`)
            expect(user).toBe(undefined)
            done()
        })

    })

    test("getUserById should return John Doe", (done)=>{
        const id= 1

        getUserById(id, (err, user)=>{
            expect(err).toBeUndefined()
            expect(user).toEqual({
                id: 1,
                name: "John Doe"
            })
            done()
        })
    })
})
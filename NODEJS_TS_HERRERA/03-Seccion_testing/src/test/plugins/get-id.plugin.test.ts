import { getUUID } from "../../plugins"

describe('get-id.plugin', ()=>{
    
    test('getUUID should return a uuid', ()=>{
        const uuid = getUUID()

        expect(typeof uuid).toBe('string')
        expect(uuid.length).toBe(36)
    })
})
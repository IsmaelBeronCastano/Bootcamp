describe('App', ()=>{
    it('should be true', ()=>{
        expect(true).toBe(true)
    })

    test("Should be 30", ()=>{
        //Arrange
        const num1 = 10
        const num2 = 20
        //Action
        const result = num1+num2
        //Assert
        expect(result).toBe(30)
    })
})
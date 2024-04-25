export class CategoryDto{
   private constructor(
       public readonly name: string,
       public readonly avaliable: boolean
    ){}

    static create(object: {[key:string]:any}):[string?, CategoryDto?] {

        const {name, avaliable}=object
        if(!name) return [`Name ${name} don't exists`, undefined]
        let avaliableBoolean= avaliable
        if(typeof avaliable !== 'boolean'){
            avaliableBoolean = (avaliable === true)
        }

        return [undefined, new CategoryDto(name, avaliableBoolean)]
    }
}

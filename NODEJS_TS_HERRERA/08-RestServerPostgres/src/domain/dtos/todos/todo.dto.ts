export class CreateTodoDto {

    private constructor(
        public readonly text: string
    ){
        this.text = text
    }

    static create(props: {[keys: string]: any}): [string?, CreateTodoDto?] {
        const {text} = props

        if(!text) return ["Text is required", undefined]

        
        
        return [undefined, new CreateTodoDto(text)]
    }
    
}
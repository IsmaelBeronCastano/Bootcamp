export class PaginationDto{
 

    constructor(
        public readonly page:number,
        public readonly limit:number
    ){}

    static create(page:number =1,limit:number = 10 ):[string?, PaginationDto?]{

        if(typeof page !== 'number' || typeof limit !== 'number') return ['Invalid data', undefined]
        if(page < 0 || limit < 0) return ['Page and  limit must be greater than 0', undefined]


        return [undefined, new PaginationDto(page, limit)]
    }
}
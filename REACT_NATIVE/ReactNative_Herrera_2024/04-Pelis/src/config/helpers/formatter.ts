export class Formatter{
    public static currency(value: number): string | string[] | undefined {

        return new Intl.NumberFormat('en-US',{
            style: 'currency',
            currency: 'USD'
        }).format(value)
    }
}
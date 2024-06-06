import { buildLogger, logger as winstonLogger } from "../../plugins"

describe('logger.plugin', ()=>{

    test('buildLogger should return a function logger', ()=>{

        const logger = buildLogger('test')

        expect(typeof logger.log).toBe('function')
        expect(typeof logger.error).toBe('function')
    })

    test('logger has been called', ()=>{
        //preparación
        const winstonLoggerMock= jest.spyOn(winstonLogger, 'log')
        const message = 'test message'

        const service= 'test service'

        //estímulo
        const logger = buildLogger(service)

        logger.log(message)

        //aserciones
        expect(winstonLoggerMock).toHaveBeenCalled()

    })
})
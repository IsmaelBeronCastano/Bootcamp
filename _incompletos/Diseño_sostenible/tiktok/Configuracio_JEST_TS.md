# Configuració JEST + TypeScript 

## COM CONFIGURAR JEST AMB TYPESCRIPT A VSCODE EN MENYS D'UN MINUT

- Instalo
  - jest
  - ts-jest
  - supertest
  - TypeScript
- També instalo els tipus
  - @types/jest
- Genero l'arxiu de configuració de jest
  - npx jest --init
- Li dic que si al coverage i a v8.Clear mocks li puc dir que si, però per aprendre potser no
- Al jest.config que he generat agrego aquest codi
- 
~~~js
preset: 'ts-jest',
testEnvironment: "jest-environment-node",
~~~

- Genero els scripts al package.json

~~~json
"test": "jest",
"test:watch":"jest --watch",
"test:coverage": "jest --coverage"
~~~

- Afageixo la carpeta test a src y escric la meva primera prova

~~~js
describe('App', ()=>{
    it('should be true', ()=>{
        expect(true).toBe(true)
    })
})
~~~

- Executo npm run test
- Perquè no et doni problemes com el de que el jest.config es fora del rootDir afageix aquest codi al ts.config abans del compilerOptions


~~~json
{
  "include": ["src/**/*"],
  "exclude":  ["node_modules", "**/*/spec.ts", "**/*/test.ts"],
  "compilerOptions": {
 }}
~~~

- I ja ho tens!


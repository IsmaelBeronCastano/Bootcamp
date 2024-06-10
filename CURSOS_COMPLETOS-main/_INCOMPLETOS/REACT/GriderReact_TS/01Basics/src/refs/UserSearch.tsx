import { useState, useRef, useEffect } from "react"

const users = [
    {name: 'Sara', age: 30},
    {name: 'Pere', age: 45},
    {name: 'Joan', age: 32},
    {name: 'Maria', age: 43},
]

const FindUser: React.FC = () => {

    //creo la ref
    const inputRef = useRef<HTMLInputElement | null>(null)

    useEffect(()=>{

        if(!inputRef.current) return
        inputRef.current.focus()
    }, [])

    const [name, setName]= useState('')
    const [user, setUser] = useState<{name: string, age: number} | undefined>()

    const findUser = ()=>{
        const foundUser = users.find((user)=>{
            return user.name === name

        })

        setUser(foundUser)
    }

  return (
    <div>
        <h1>Find User</h1>

        <input ref={inputRef} type="text" value={name} onChange={(e)=>setName(e.target.value)} />
        <button onClick={findUser}>Find</button>

        <div>
            {user && user.name}
            {user && user.age}
        </div>
    </div>
  )
}

export default FindUser
import { useState } from "react"


const List: React.FC = () => {

    const [name,setName]= useState('') //Si declaro un string vació en el state, Typescript infiere en el tipo del state

    const [guests, setGuests] = useState<string[]>([]) //asi le digo que mi state será un array de strings

    const handleGuests =()=>{
        setName('')

        setGuests([...guests, name]) //tomo el array existente de guests y le añado el nuevo nombre
    }

  return (
    <div>
        <h1>Party List</h1>

        <ul>
            {guests.map((guest)=>{
               return <li key={guest}>{guest} </li>    
            })}

        </ul>
        

        <input type="text" value={name} onChange={(e)=>setName(e.target.value)} />
        <button onClick={handleGuests}>Add</button>

    </div>
  )
}

export default List
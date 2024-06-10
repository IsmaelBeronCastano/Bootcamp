import { useState } from "react"
import { useActions } from "../hooks/useActions"
import { useTypedSelector } from "../hooks/useTypedSelector"



const RepositoriesList: React.FC = () => {

  const [term, setTerm] = useState('')
  //desestructuro searchRepositories de useActions
  const {searchRepositories} = useActions()

                                //cambio el useSelector por el useTypedSelector que he creado. Ahora sabe de que tipo es el state
  const {data, error, loading} = useTypedSelector((state)=>state.repositories) 

  console.log(data)


  const onSubmit=(e: React.FormEvent<HTMLFormElement> )=>{
    e.preventDefault()
    
    //solo tengo que llamarlo y pasarle el term
    searchRepositories(term)
  }

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input type="text"value={term} onChange={e=> setTerm(e.target.value)} />
        <button>Search</button>
      </form>
      {error && <h3>{error}</h3>}
      {loading && <h3>Loading...</h3>}
      {!error && !loading  &&
      data.map(name=>(
        <div key={name}>
          <h3>{name}</h3>
        </div>
      ))} 
    </div>
  )
}

export default RepositoriesList
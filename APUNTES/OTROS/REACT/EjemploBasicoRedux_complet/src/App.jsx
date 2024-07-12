import { useDispatch, useSelector } from "react-redux"
import { decrement, increment } from "./store/slices/counter/counterSlice"


function App() {
const dispatch = useDispatch()
const {counter} = useSelector((state)=> state.counter)  

  return (
    <>
    <h1>{counter}</h1>

    <button onClick={()=>dispatch(increment())}>counter add</button>
   

    </>
  )
}

export default App

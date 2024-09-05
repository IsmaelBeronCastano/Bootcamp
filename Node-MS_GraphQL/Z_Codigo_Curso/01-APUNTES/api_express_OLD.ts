import express, { Request, Response } from 'express'
import axios from 'axios';


const app = express()

app.use( express.json() ); // raw
app.use( express.urlencoded({ extended: true }) ); // x-www-form-urlencoded
//app.use(cors())
app.use(express.json)

app.post("/api/v1", async (req: Request, res: Response)=>{
  const {event, data: requestData} = req.body

  if(!event){
    return res.status(400).json({
      message: "Event is required"
    })
  }

      

    try {
      const {data} = await axios.post("http://localhost:3001/events",{
        requestData,
        event: event.toUpperCase()
      })
     
      return res.status(200).json({
        message: "Success!!",
        data
      })

    } catch (error) {
      return res.status(500).json({
        message: "Error gateway",
        
      })       
    }
})

app.listen(process.env.PORT, ()=>{
  console.log("API GATEWAY IS RUNNING ON PORT", process.env.PORT)
})



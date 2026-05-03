import axios from "axios"
import { useState } from "react"

export default function SignUpRecruteur(){
    let [recruteur,setrecruteur] = useState({first_name:"",last_name:"",email:"",numero_telephone:"",password:"",Entreprise:""})
    const getvalue = (event) =>{
        setrecruteur((prev)=>({
            ...prev,
            [event.target.name]:event.target.value
        }))
    }
    const Signuptalent = () =>{
        axios.post('http://127.0.0.1:8000/api/signup/',recruteur).then((response)=>{
            console.log(response.data)
        }).catch((error)=>{
            console.log(error)
        })
    }
    console.log(recruteur)
    return <>
        <div>
            <label htmlFor="">Fisrt name</label>
            <input type="text" name="first_name" onChange={getvalue} required/><br />
            <label htmlFor="">Last name</label>
            <input type="text" name="last_name" onChange={getvalue} required/><br />
            {/* <label htmlFor="">Fisrt name</label>
            <input type="text" name="first_name"/> */}
            <label htmlFor="">Entreprise name</label>
            <input type="text" name="Entreprise" onChange={getvalue} required/><br />
            <label htmlFor="">email</label>
            <input type="email" name="email" onChange={getvalue} required/><br />
            <label htmlFor="">Numero de telephone</label>
            <input type="text" name="numero_telephone" onChange={getvalue} required/><br />
            <label htmlFor="">Password</label>
            <input type="password" name="password" onChange={getvalue} required/><br />
            <button type="button" onClick={Signuptalent}>test</button>
        </div>
    </>
}
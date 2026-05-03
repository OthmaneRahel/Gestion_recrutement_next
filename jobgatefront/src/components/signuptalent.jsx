import axios from "axios"
import { useState } from "react"

export default function SignUpTalent(){
    let [talent,settalent] = useState({first_name:"",last_name:"",cv:"",email:"",numero_telephone:"",password:""})
    const getvalue = (event) =>{
        if(event.target.name === 'cv'){
            settalent((prev)=>({
                ...prev,
                cv: event.target.files[0],
            }))
        }else{
            settalent((prev)=>({
                ...prev,
                [event.target.name]:event.target.value
            }))
        }
    }
    const Signuptalent = () =>{
        const formdata = new FormData()
        formdata.append('first_name',talent.first_name)
        formdata.append('last_name',talent.last_name)
        formdata.append('cv',talent.cv)
        formdata.append('email',talent.email)
        formdata.append('numero_telephone',talent.numero_telephone)
        formdata.append('password',talent.password)
        axios.post('http://127.0.0.1:8000/api/signup/',formdata,{
            headers: { "Content-Type": "multipart/form-data" },
        }).then((response)=>{
            console.log(response.data)
        }).catch((error)=>{
            console.log(error)
        })
    }
    console.log(talent)
    return <>
        <div>
            <label htmlFor="">Fisrt name</label>
            <input type="text" name="first_name" onChange={getvalue} required/><br />
            <label htmlFor="">Last name</label>
            <input type="text" name="last_name" onChange={getvalue} required/><br />
            {/* <label htmlFor="">Fisrt name</label>
            <input type="text" name="first_name"/> */}
            <label htmlFor="">Cv</label>
            <input type="file" name="cv" accept="application/pdf" onChange={getvalue} required/><br />
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
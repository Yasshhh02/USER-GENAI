import React, { useState } from 'react'
import { useNavigate,Link } from 'react-router'
// import { set } from '../../../../../Backend/src/app';
import { useAuth } from '../hooks/useAuth';


const Register = () => {


    const navigate = useNavigate();
    
    const[username,setUsername] = useState("")
    const[email,setEmail] = useState("")
    const[password,setPassword] = useState("")

    const {loading,handleRegister}= useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault()
        await handleRegister({username,email,password})
        navigate('/')
    } 
    if (loading) {
        return (
            <main className="login-loading-screen">
                <div className="login-loader"></div>
                <p>Loading...</p>
            </main>
        );
    }


  return (
    <main>
        <div className="form-conatiner">
            <h1>Register</h1>

            <form onSubmit={handleSubmit}>
            <div className="input-group">
                <label htmlFor='username'>Username</label>
                <input onChange ={(e) => {setUsername(e.target.value)}}
                type='text' id='username' name='username' placeholder='Enter username'/>
            </div>
            <div className="input-group">
                <label htmlFor='email'>Email</label>
                <input onChange ={(e) => {setEmail(e.target.value)}}
                type='email' id='email' name='email' placeholder='Enter email address'/>
            </div>
            <div className="input-group">
                <label htmlFor='password'>Password</label>
                <input onChange ={(e) => {setPassword(e.target.value)}}
                type='password' id='password' name='password' placeholder='Enter password'/>
            </div>
            <button className='button primary-button' >Register</button>
            </form>

            <p>Already Have an account? <Link to={"/login"}>Login</Link></p>
        </div>
    </main>
  )
}

export default Register

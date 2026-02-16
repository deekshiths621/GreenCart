import React from 'react'
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

const Login = () => {

    const {setShowUserLogin, setUser, setIsSeller, setIsAdmin, axios, navigate} = useAppContext()

    const [loginType, setLoginType] = React.useState("user"); // user, admin, seller
    const [state, setState] = React.useState("login");
    const [name, setName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");

    const onSubmitHandler = async (event)=>{
        try {
            event.preventDefault();

            if (loginType === "user") {
                const {data} = await axios.post(`/api/user/${state}`,{
                    name, email, password
                });
                if (data.success){
                    navigate('/')
                    setUser(data.user)
                    setShowUserLogin(false)
                    toast.success(state === "login" ? "Logged in successfully" : "Account created successfully")
                }else{
                    toast.error(data.message)
                }
            } else if (loginType === "admin") {
                const {data} = await axios.post('/api/admin/login', {email, password});
                if(data.success){
                    setIsAdmin(true)
                    setShowUserLogin(false)
                    navigate('/admin')
                    toast.success(data.message)
                }else{
                    toast.error(data.message)
                }
            } else if (loginType === "seller") {
                const {data} = await axios.post('/api/seller/login', {email, password});
                if(data.success){
                    setIsSeller(true)
                    setShowUserLogin(false)
                    navigate('/seller')
                    toast.success("Logged in successfully")
                }else{
                    toast.error(data.message)
                }
            }

        } catch (error) {
            toast.error(error.message)
        }
    }

  return (
    <div onClick={()=> setShowUserLogin(false)} className='fixed top-0 bottom-0 left-0 right-0 z-30 flex items-center text-sm text-gray-600 bg-black/50'>

      <form onSubmit={onSubmitHandler} onClick={(e)=>e.stopPropagation()} className="flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-[352px] rounded-lg shadow-xl border border-gray-200 bg-white">
            
            {/* Login Type Selector */}
            <div className="w-full">
                <div className="flex gap-2 mb-4">
                    <button
                        type="button"
                        onClick={() => {setLoginType("user"); setState("login")}}
                        className={`flex-1 py-2 px-3 rounded-lg font-medium transition ${
                            loginType === "user" 
                            ? "bg-primary text-white" 
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                    >
                        User
                    </button>
                    <button
                        type="button"
                        onClick={() => {setLoginType("admin"); setState("login")}}
                        className={`flex-1 py-2 px-3 rounded-lg font-medium transition ${
                            loginType === "admin" 
                            ? "bg-primary text-white" 
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                    >
                        Admin
                    </button>
                    <button
                        type="button"
                        onClick={() => {setLoginType("seller"); setState("login")}}
                        className={`flex-1 py-2 px-3 rounded-lg font-medium transition ${
                            loginType === "seller" 
                            ? "bg-primary text-white" 
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                    >
                        Seller
                    </button>
                </div>
            </div>

            <p className="text-2xl font-medium m-auto">
                <span className="text-primary">{loginType.charAt(0).toUpperCase() + loginType.slice(1)}</span> {state === "login" ? "Login" : "Sign Up"}
            </p>
            
            {state === "register" && loginType === "user" && (
                <div className="w-full">
                    <p>Name</p>
                    <input onChange={(e) => setName(e.target.value)} value={name} placeholder="type here" className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" type="text" required />
                </div>
            )}
            <div className="w-full ">
                <p>Email</p>
                <input onChange={(e) => setEmail(e.target.value)} value={email} placeholder="type here" className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" type="email" required />
            </div>
            <div className="w-full ">
                <p>Password</p>
                <input onChange={(e) => setPassword(e.target.value)} value={password} placeholder="type here" className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" type="password" required />
            </div>
            
            {loginType === "user" && (
                state === "register" ? (
                    <p>
                        Already have account? <span onClick={() => setState("login")} className="text-primary cursor-pointer">click here</span>
                    </p>
                ) : (
                    <p>
                        Create an account? <span onClick={() => setState("register")} className="text-primary cursor-pointer">click here</span>
                    </p>
                )
            )}
            
            <button className="bg-primary hover:bg-primary-dull transition-all text-white w-full py-2 rounded-md cursor-pointer">
                {state === "register" && loginType === "user" ? "Create Account" : "Login"}
            </button>
        </form>
    </div>
  )
}

export default Login

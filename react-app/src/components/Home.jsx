import { useEffect } from "react";
import Header from "./Header";
import { Link, useNavigate } from "react-router-dom";

function Home(){

    const navigate = useNavigate()
    useEffect(()=>{
            if(localStorage.getItem('token')){
                navigate('/login');
            }
    },[])
    return (
        <div>
            <Header/>
            <Link to="/add-product">ADD PRODUCT</Link>
        </div>
    )
}

export default Home;

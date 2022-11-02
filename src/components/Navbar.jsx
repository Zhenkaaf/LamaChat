import { signOut } from "firebase/auth";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { auth } from "../firebase";


const Navbar = () => {
    const {currentUser} = useContext(AuthContext)

    return (
        <div className="navbar">
         <span className="logo">Lama chat</span>
         <div className="user">
            <img src={currentUser.photoURL ? currentUser.photoURL : 'https://okeygeek.ru/wp-content/uploads/2020/03/no_avatar.png'} alt="" />
            <span>{currentUser.displayName}</span>
            <button onClick={()=>signOut(auth)}>logout</button>
         </div>
        </div>
    )
}
export default Navbar;
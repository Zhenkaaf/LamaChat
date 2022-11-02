import { onAuthStateChanged } from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import { auth } from "../firebase";

export const AuthContext = createContext();
//любой компонент который мы обернем в AuthContextProvider будет иметь доступ к currentUser
export const AuthContextProvider = ({ children }) => {

    const [currentUser, setCurrentUser] = useState({});

    useEffect(() => {

        //Получить текущего вошедшего пользователя
        console.log('сначала тут');
        const unsub = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            console.log('прверка залогинены ли?', user);
        });


        return () => {
            unsub();
            console.log('return сработает только при закрытии компонента  WILL UNMOUNT чтоб не было утечки памяти.');

        }
    }, []);



    return (
        <AuthContext.Provider value={{ currentUser }}>
            {children}
        </AuthContext.Provider>
    );
};
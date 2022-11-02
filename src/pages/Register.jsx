import Add from './../img/add-user.png';
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, storage, db } from "./../firebase";
import { useState } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {

    const [err, setErr] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const displayName = e.target[0].value;
        const email = e.target[1].value;
        const password = e.target[2].value;
        const file = e.target[3].files[0];
        console.log('file=======', file);

        try {

            const res = await createUserWithEmailAndPassword(auth, email, password);
            console.log('ждём ответ с сервера');
            console.log('res.user ====== ', res.user);
            console.log('дождались');


            if (file != undefined) {

                const storageRef = ref(storage, displayName);
                console.log('storageRef=======', storageRef);


                const uploadTask = uploadBytesResumable(storageRef, file);
                console.log('uploadTask=======', uploadTask);
                uploadTask.on(
                    (error) => {
                        console.log('errrorrrr==========', error);
                        // Handle unsuccessful uploads
                        setErr(true);
                    },
                    () => {
                        // Handle successful uploads on complete
                        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                        getDownloadURL(uploadTask.snapshot.ref)
                            .then(async (downloadURL) => {
                                //мы загрузили фото в storage, здесь получаем ссылку на это фото и обновляем профиль usera, чтоб он был с фото
                                console.log('File available at', downloadURL);
                                try {
                                    await updateProfile(res.user, {
                                        displayName,
                                        photoURL: downloadURL,
                                    });

                                    await setDoc(doc(db, "users", res.user.uid), {
                                        uid: res.user.uid,
                                        displayName,
                                        email,
                                        photoURL: downloadURL
                                    });

                                    await setDoc(doc(db, "userChats", res.user.uid), {
                                      /*   uid: res.user.uid,
                                        displayName,
                                        email,
                                        photoURL: downloadURL */
                                    });
                                    navigate('/');
                                }
                                catch (er) {
                                    console.log('###############################################################no photo!!', er);
                                }
                            });
                    }
                );
            }
            else {
                try {
                    await updateProfile(res.user, {
                        displayName,
                        photoURL: null,
                    });

                    await setDoc(doc(db, "users", res.user.uid), {
                        uid: res.user.uid,
                        displayName,
                        email,
                        photoURL: null
                    });

                    await setDoc(doc(db, "userChats", res.user.uid), {
                       /*  uid: res.user.uid,
                        displayName,
                        email,
                        photoURL: null */
                    });
                    navigate('/');
                }
                catch (er) {
                    console.log('###############################################################no photo!!', er);
                }
            }
        }
        catch (err) {
            setErr(true);
        }
        /* createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                console.log(user);
                // ...
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                // ..
            }); */
    }


    return (
        <div className="formContainer">
            <div className="formWrapper">
                <span className="logo">Lama Chat</span>
                <span className="title">Register</span>
                <form onSubmit={handleSubmit}>
                    <input type="text" placeholder="display name" />
                    <input type="email" placeholder="email" />
                    <input type="password" placeholder="password" />
                    <input style={{ display: 'none' }} type="file" id="file" />
                    <label htmlFor="file">
                        <img style={{ width: '32px' }} src={Add} alt="" />
                        <span>Add an avatar</span>
                    </label>
                    <button>Sign up</button>
                    {err && <span>Something went wrong</span>}
                </form>
                <p>You do have an account?<Link to='/login'>Login</Link></p>
            </div>
        </div>
    )
}
export default Register;
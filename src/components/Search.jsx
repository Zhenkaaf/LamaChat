import { useContext, useState } from "react";
// Create a reference to the cities collection
import { collection, query, where, getDoc, setDoc, doc, updateDoc, serverTimestamp, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";


const Search = () => {

    const [userName, setUserName] = useState('');
    const [user, setUser] = useState(null);
    const [err, setErr] = useState(false);
    const { currentUser } = useContext(AuthContext);
    const { dispatch } = useContext(ChatContext);

    const handleSearch = async () => {
        const usersRef = collection(db, "users");
        // Create a query against the collection.
        const q = query(usersRef, where("displayName", "==", userName));
        try {
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                console.log('doc==== ', doc);
                setUser(doc.data());
            });
        }
        catch (err) {
            setErr(true);
        }
    };

    const handleKey = (e) => {
        e.code === 'Enter' && handleSearch();
    };

    const handleSelect = async (u) => {
        //check whether the group(chats in firestore) exists, if not - need create
        const combinedId = currentUser.uid > user.uid ? currentUser.uid + user.uid : user.uid + currentUser.uid;
        try {
            const res = await getDoc(doc(db, 'chats', combinedId));
            if (!res.exists()) {
                // create a chat in chats collection
                await setDoc(doc(db, 'chats', combinedId), { messages: [] });

                //create user chats
                const currentUserChatsRef = doc(db, "userChats", currentUser.uid);
                await updateDoc(currentUserChatsRef, {
                    [combinedId + '.userInfo']: {
                        uid: user.uid,
                        displayName: user.displayName,
                        photoURL: user.photoURL
                    },
                    [combinedId + '.date']: serverTimestamp()
                });

                const userChatsRef = doc(db, "userChats", user.uid);
                await updateDoc(userChatsRef, {
                    [combinedId + '.userInfo']: {
                        uid: currentUser.uid,
                        displayName: currentUser.displayName,
                        photoURL: currentUser.photoURL
                    },
                    [combinedId + '.date']: serverTimestamp()
                });
            }
        }
        catch (err) {

        }
        console.log('***************************************************************', user);
        dispatch({type: 'CHANGE_USER', payload: u})
        setUser(null);
        setUserName('');
    };


    return (
        <div className="search">
            <div className="searchForm">
                <input type="text" placeholder="Find a user" onChange={e => setUserName(e.target.value)} onKeyDown={handleKey} value={userName} />
            </div>
            {err && <span>User not found</span>}
            {user && <div className="userChat" onClick={() => handleSelect(user)}>
                <img src={user.photoURL} alt="" />
                <div className="userChatInfo">
                    <span>{user.displayName}</span>
                </div>
            </div>}
        </div>
    )
}
export default Search;


/* const handleSelect = (u) => {
    dispatch({type: 'CHANGE_USER', payload: u})
}

return (
    <div className="chats">
        {Object.entries(chats)?.map((chat) => (
            <div className="userChat" key={chat[0]} onClick={() => handleSelect(chat[1].userInfo)}>
                <img src={chat[1].userInfo.photoURL} alt="" />
                <div className="userChatInfo">
                    <span>{chat[1].userInfo.displayName}</span>
                    <p>{chat[1].userInfo.lastMessage?.text}</p>
                </div>
            </div>
        ))}
    </div>
) */
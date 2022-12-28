import { arrayUnion, doc, serverTimestamp, Timestamp, updateDoc } from 'firebase/firestore';
import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';
import { db, storage } from '../firebase';
import Img from './../img/290132_gallery_image_photo_photography_picture_icon.png';
import Attach from './../img/9117946_attach_icon.png';
import { v4 as uuidv4 } from 'uuid';
import { getDownloadURL, uploadBytesResumable, ref } from 'firebase/storage';

const Input = () => {

  const [text, setText] = useState('');
  const [img, setImg] = useState(null);
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);
  const handleSend = async () => {
    if (img) {
      const storageRef = ref(storage, uuidv4());
      const uploadTask = uploadBytesResumable(storageRef, img);

      uploadTask.on(

        (error) => {

          /*  setErr(true); */
        },
        () => {
          // Handle successful uploads on complete
          // For instance, get the download URL: https://firebasestorage.googleapis.com/...
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            await updateDoc(doc(db, 'chats', data.chatId), {
              messages: arrayUnion({
                id: uuidv4(),
                text,
                senderId: currentUser.uid,
                date: Timestamp.now(),
                img: downloadURL
              }),
            });
          });
        }
      );
    }

    else {
      await updateDoc(doc(db, 'chats', data.chatId), {
        messages: arrayUnion({
          id: uuidv4(),
          text,
          senderId: currentUser.uid,
          date: Timestamp.now()
        }),
      });
    }

    await updateDoc(doc(db, 'userChats', currentUser.uid), {
      [data.chatId + '.lastMessage']: {
        text,
      },
      [data.chatId + '.date']: serverTimestamp(),
    });

    await updateDoc(doc(db, 'userChats', data.user.uid), {
      [data.chatId + '.lastMessage']: {
        text,
      },
      [data.chatId + '.date']: serverTimestamp(),
    });

    setText('');
    setImg(null);
  };

  return (
    <div className="input">
      <input type="text" placeholder="Type something..." onChange={e => setText(e.target.value)} value={text}/>
      <div className="send">
       {/*  <img src={Attach} alt="" /> */}
        <input type="file" style={{ display: 'none' }} id='file' onChange={e => setImg(e.target.files[0])} />
        <label htmlFor="file">
          <img src={Img} alt="" />
        </label>
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  )
}
export default Input;
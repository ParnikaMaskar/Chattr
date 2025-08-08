import { View, Text, TextInput, TouchableOpacity, Alert, Button, Keyboard } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { StatusBar } from 'expo-status-bar';
import ChatRoomHeader from '../../components/ChatRoomHeader'
import MessageList from '../../components/MessageList';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { Feather, Ionicons } from '@expo/vector-icons';
import CustomKeyboardView from '../../components/CustomKeyboardView'
import { useAuth } from '../../context/authContext';
import { getRoomId } from '../../util/common';
import { setDoc, doc, Timestamp, collection, addDoc, orderBy, onSnapshot, query } from 'firebase/firestore';
import { db } from '../../firebaseConfig';



export default function ChatRoom() {
    const item = useLocalSearchParams(); //second user
    const {user} = useAuth(); //logged in user
    const router = useRouter();
    const [messages, setMessages] = useState([]);
    const textRef = useRef('');
    const inputRef = useRef(null);
    const ScrollViewRef = useRef(null);

    useEffect(()=>{
      createRoomIfNotExists();

      let roomId = getRoomId(user?.userId, item?.userId);
      const docRef = doc(db, 'rooms', roomId);
      const messagesRef = collection(docRef, "messages");
      const q = query(messagesRef, orderBy('createdAt', 'asc'));

      let unsub = onSnapshot(q, (snapshot)=>{
        let allMessages = snapshot.docs.map(doc =>{
          return doc.data();
        });
        setMessages([...allMessages]);
      });

      const KeyDidShowListner = Keyboard.addListener(
        'keyboardDidShow', updateScrollView
      )

      return ()=>{
        unsub();
        KeyDidShowListner.remove();
      }

    },[]);

    useEffect(()=>{
      updateScrollView();
    },[messages])

    const updateScrollView = ()=>{
      setTimeout(()=>{
        ScrollViewRef?.current?.scrollToEnd({animated: true})
      },100)
    }

    const createRoomIfNotExists = async ()=>{
      //room id
      let roomId = getRoomId(user?.userId, item?.userId);
      await setDoc(doc(db,"rooms",roomId),{
        roomId,
        createdAt : Timestamp.fromDate(new Date())
      });
    }

    const handleSendMessage = async ()=>{
      let message = textRef.current.trim();
      if(!message) return;
      try{
        let roomId = getRoomId(user?.userId, item?.userId);
        const docRef = doc(db, 'rooms', roomId);
        const messagesRef = collection(docRef, "messages");
        textRef.current = "";
        if(inputRef) inputRef?.current.clear();

        const newDoc = await addDoc(messagesRef, {
          userId: user?.userId,
          text: message,
          profileUrl: user?.profileUrl,
          senderName: user?.username,
          createdAt: Timestamp.fromDate(new Date())
        });

        // console.log('new message id: ', newDoc.id)
      }catch(err){
        Alert.alert('Message', err.message);
      }
    }

    // console.log('messages', messages);
    return (
      <CustomKeyboardView inChat={true}>
        <View className="flex-1 bg-white">
          <StatusBar style="dark" />
          <ChatRoomHeader user={item} router={router} />
          <View className="h-3 border-b border-neutral-300" />
          <View className="flex-1 justify-between bg-neutral-100 overflow-visible">
            {/* Message List */}
            <View className="flex-1">
              <MessageList  ScrollViewRef={ScrollViewRef}messages={messages} currentUser={user} />
            </View>
            {/* Input Section */}
            <View style={{ marginBottom: hp(1.7) }} className="pt-2">
              <View className="flex-row items-center mx-3 bg-white border border-neutral-300 rounded-full px-3 py-2">
                {/* TextInput */}
                <TextInput
                  ref={inputRef}
                  onChangeText={(value) => (textRef.current = value)}
                  placeholder="Type message..."
                  style={{ fontSize: hp(2), flex: 1 }}
                  className="mr-2"
                />
                {/* Send Button */}
                <TouchableOpacity
                  onPress={handleSendMessage}
                  style={{
                    backgroundColor: "#f0f0f0",
                    padding: hp(1),
                    borderRadius: 100,
                  }}
                >
                  <Ionicons name="send" size={hp(2.7)} color="#737373" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </CustomKeyboardView>
    );
    
}
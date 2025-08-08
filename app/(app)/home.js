import { View, Text, Button, Pressable, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useAuth } from '../../context/authContext'
import { StatusBar } from 'expo-status-bar';
import ChatList from '../../components/ChatList';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Loading from '../../components/Loading';
import { getDocs, query, where } from 'firebase/firestore';
import { usersRef } from '../../firebaseConfig';

export default function Home() {
  const { logout, user } = useAuth();
  const [users, setUser] = useState([]);
  useEffect(()=>{
    if(user?.uid)
    getUsers();
  },[])

  const getUsers = async ()=>{
    //fetch users form firebase
    const q = query(usersRef, where('userId', '!=', user?.uid));

    const querySnapshot = await getDocs(q);
    let data = [];
    querySnapshot.forEach(doc=>{
      data.push({...doc.data()});
    });
     
    setUser(data);
    
  }
  
  // console.log('user data: ', user);
  return (
    <View className="flex-1 bg-white">
      <StatusBar style='light'/>

      {
        users.length>0? (
          <ChatList currentUser={user} users={users} />
        ):(
          <View className="flex items-center" style={{top: hp(30)}}>
            <Loading size={hp(8)}/>
          </View>  
        )
      }
    </View>
  )
}
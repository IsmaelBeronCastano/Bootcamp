import React, { useEffect } from 'react'
import { useAuthStore } from '../store/auth.store'
import { Button, Text, View } from 'react-native'

const LoginPage = () => {

    const authStatus = useAuthStore(state=> state.status)
    const user = useAuthStore(state => state.user)
    const login = useAuthStore(state => state.login)
    const logout = useAuthStore(state => state.logout)

    useEffect(()=>{
      setTimeout(()=>{
        logout();
      }, 1500)
    }, [])

    if(authStatus=== 'checking'){
      return <View>
              <Text>Loading...</Text>
              </View>
    }

  return (
    <View>
        <Text>Login Page</Text>
        {(authStatus === 'authenticated')
        ? <Text>Autenticado como : {JSON.stringify(user, null, 2)}</Text>
        : <Text>No autenticado</Text> 
        }

        {(authStatus === 'authenticated')
        ? <View><Button  title="logout" onPress={logout}/></View>
        : <View><Button  title="login" onPress={()=>login("", "")}/></View>
      }
    </View>
  )
}

export default LoginPage
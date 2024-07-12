import React from 'react'
import { Button, FlatList, Text, View } from 'react-native'
import useUsers from '../hooks/useUsers'


const UsersPage = () => {

const {nextPage, previousPage, users} = useUsers()

  return (
    <View>
      <FlatList 
        data= {users.map(({email, first_name})=>({
            key: email,
            first_name            
        }))}
        renderItem={({item})=><Text>{item.first_name}</Text>}
      />

      <Button title="Previous" onPress={previousPage} />
      <Button title="Next" onPress={nextPage} />

    </View>
  )
}

export default UsersPage
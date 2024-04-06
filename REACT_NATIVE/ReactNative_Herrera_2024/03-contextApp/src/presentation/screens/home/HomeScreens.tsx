
import React from 'react'
import { Text, View } from 'react-native'
import { useProfileStore } from '../../store/profile-store'
import { styles } from '../../../config/appTheme'

export const HomeScreen  = () => {
  
    const name = useProfileStore(get=> get.name)
    const email = useProfileStore(get=> get.email)
  
    return (
      <View style={styles.container} >
        <Text style={styles.title}>{name}</Text>
        <Text style={styles.title}>{email}</Text>
      </View>
    )
  
}


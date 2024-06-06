import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { MenuItem } from '../interfaces/appInterfaces'
import { StyleSheet } from 'react-native'
import  Icon  from 'react-native-vector-icons/Ionicons'
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { RootStackParamList } from '../navigator/Navigator'

interface Props{
    menuItem: MenuItem
}

type navigationPropList = StackNavigationProp<RootStackParamList>


const FlatListMenuItem = ({menuItem}: Props) => {

    const navigation = useNavigation<navigationPropList>()

    return (
        <TouchableOpacity
        activeOpacity={0.8}
        onPress={()=>navigation.navigate(menuItem.component)}
        >
        <View style={styles.container} >
            <Icon
            name={menuItem.icon}
            color="gray"
            size={23}
            />
            <Text style={styles.itemText}>
                {menuItem.name}
                </Text>
            
            <View style={{flex:1}} />
            <Icon
            name="chevron-forward-outline"
            color="gray"
            size={23}
            />
            
           
        </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
      container:{
        flexDirection: 'row'
      },
      itemText:{
        marginLeft: 10,
        fontSize: 19
      }
});

export default FlatListMenuItem
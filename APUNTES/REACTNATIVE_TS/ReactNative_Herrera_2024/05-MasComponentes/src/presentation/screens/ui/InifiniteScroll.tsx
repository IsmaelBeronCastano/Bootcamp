
import React, { useState } from 'react'
import { Image, Text, View, VirtualizedListWithoutRenderItemProps } from 'react-native'
import { CustomView } from '../../components/ui/CustomView'
import { Title } from '../../components/ui/Title'
import { colors } from '../../../config/theme/theme'
import { FlatList } from 'react-native-gesture-handler'
import { ActivityIndicator } from 'react-native-paper'
import { FadeInImage } from './FadeInImage'

export const InfiniteScroll = () => {

    const [numbers, setNumbers] = useState([0,1,2,3,4,5])

    const loadMore =()=>{
        const newArray = Array.from({length: 5}, (_,i)=>numbers.length +i)
        setNumbers([...numbers, ...newArray])
    }


  return (
    <CustomView margin>
      <Title text="InfiniteScroll" />
      <FlatList
        onEndReached={loadMore}
        data={numbers}
        renderItem={({item}: any)=>(
            <ListItem number={item} />
        )}
        onEndReachedThreshold={0.6}
        keyExtractor={(item)=> item.toString()}
        ListFooterComponent={()=>(
            <View style={{height: 150, justifyContent: 'center'}} >
                <ActivityIndicator size={50} color={colors.primary} />
            </View>
        )}  
        />
    </CustomView>
  )
}

interface ListItemProps{
    number: number
}

const ListItem = ({number}: ListItemProps)=>{
    return(
        <FadeInImage uri={`https://picsum.photos/id/${number}/500/400`} 
            style={{
                height:400,
                width: '100%'
            }}
        />
        
    )
}
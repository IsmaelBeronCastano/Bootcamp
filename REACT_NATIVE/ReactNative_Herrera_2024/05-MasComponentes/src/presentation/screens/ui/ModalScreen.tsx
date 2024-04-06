
import React, { useState } from 'react'
import { Modal, Text, View } from 'react-native'
import { CustomView } from '../../components/ui/CustomView'
import { Title } from '../../components/ui/Title'
import { Button } from '../../components/ui/Button'

export const ModalScreen = () => {

  const [isVisible, setIsVisible] = useState(false)

  return (
    <CustomView>
      <Title text="Modal" />

      <Button text="Abrir Modal" onPress={()=>setIsVisible(true)} />

      <Modal visible={isVisible}
        animationType='slide'      
        >
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.1)'
        }}>
            <View style={{paddingHorizontal: 20}} >
              <Title text="Modal Content" />
            </View>

            <View style={{flex:1}} />
          <Button  text="Cerrar Modal" onPress={()=>setIsVisible(false)} styles={{borderRadius: 0}} />
        </View>      
      </Modal>
    </CustomView>
  )
}

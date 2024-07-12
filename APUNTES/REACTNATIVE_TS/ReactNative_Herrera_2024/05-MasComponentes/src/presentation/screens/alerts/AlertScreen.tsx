import React from 'react'
import { Alert, Text, View } from 'react-native'
import { CustomView } from '../../components/ui/CustomView'
import { Title } from '../../components/ui/Title'
import { globalStyles } from '../../../config/theme/theme'
import { Button } from '../../components/ui/Button'
import prompt from 'react-native-prompt-android';
import { showPrompt } from '../../../config/adapters/prompt.adapter'

export const AlertScreen = () => {
    const createTwoButtonAlert = () =>
    Alert.alert('Alert Title', 'My Alert Msg', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'OK', onPress: () => console.log('OK Pressed')},
      
    ],
    {cancelable: true,
    onDismiss(){
        console.log('onDismiss')
    }}
    );

  const createThreeButtonAlert = () =>
    Alert.alert('Alert Title', 'My Alert Msg', [
      {
        text: 'Ask me later',
        onPress: () => console.log('Ask me later pressed'),
      },
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'OK', onPress: () => console.log('OK Pressed')},
    ]);

    const onShowPrompt = () =>{
      showPrompt({title:"Titulo", 
      subTitle:"Subtitulo",
      buttons: [
        {text: 'OK', onPress:()=>console.log('button OK')},
        {text: 'Cancel', onPress:()=>console.log('button Cancel')}
      ],
      placeholder: 'PlaceHolder'
      })
    }
    

  return (
    <CustomView style={globalStyles.globalMargin}>
      <Title safe text="Alertas" />

      <Button text="Alerta - 2 botones" onPress={createTwoButtonAlert} />

      <View style={{height: 10}} />

      <Button text="Alerta - 3 botones" onPress={createThreeButtonAlert} />
      
      <View style={{height: 10}} />

      <Button text="Prompt - Input" onPress={()=>onShowPrompt()} />
    </CustomView>
  )
}
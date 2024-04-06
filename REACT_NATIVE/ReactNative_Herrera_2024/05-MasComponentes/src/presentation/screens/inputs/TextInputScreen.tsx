import React, { useState } from 'react'
import { KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, View } from 'react-native'
import { CustomView } from '../../components/ui/CustomView'
import { Title } from '../../components/ui/Title'
import { Card } from '../../components/ui/Card'
import { globalStyles } from '../../../config/theme/theme'

export const TextInputScreen = () => {

    const [form, setForm] = useState({
        name: '',
        email:'',
        phone: ''
    })

  return (

    <KeyboardAvoidingView behavior={Platform.OS === 'ios'? 'padding': 'height'}>
    <ScrollView>

    <CustomView margin>
      <Title text="Text Input" safe />
      <Card>
        <TextInput style={globalStyles.input} 
            placeholder="Nombre completo"
            autoCapitalize='words'
            autoCorrect={false}
            onChangeText={value=>setForm({...form, name: value})}
        />
      </Card>

      <View style={{height: 10}} />
      <Card>
        <TextInput style={globalStyles.input} 
            placeholder="Email"
            autoCapitalize='words'
            autoCorrect={false}
            onChangeText={value=>setForm({...form, email: value})}
        />
      </Card>
      <View style={{height: 10}} />
      <Card>
        <TextInput style={globalStyles.input} 
            placeholder="Teléfono"
            autoCapitalize='words'
            keyboardType='phone-pad'
            autoCorrect={false}
            onChangeText={value=>setForm({...form, phone: value})}
        />
      </Card>
      <View style={{height: 10}} />

        <Card>
            <Text>{JSON.stringify(form, null, 2)}</Text>
        </Card>
        <View style={{height: 20}} />
    </CustomView>
    </ScrollView>
    </KeyboardAvoidingView>

  )
}
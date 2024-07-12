import prompt from "react-native-prompt-android";


interface Options{
    title: string
    subTitle?: string
    buttons: PromptButton[]
    promptType?: 'default' | 'plain-text' | 'secure-text'
    placeholder?: string
    defaultValue?: string
}

interface PromptButton{
    text: string
    onPress: ()=> void
    style?: "cancel" | "default" | "destructive"
}

export  const showPrompt = ({title, subTitle, buttons, promptType, placeholder, defaultValue}:Options) =>{
    prompt(
      title,
      subTitle,
      buttons,
      
      {
          type: promptType= 'plain-text',
          cancelable: false,
          defaultValue,
          placeholder
      }
  ); 
 }
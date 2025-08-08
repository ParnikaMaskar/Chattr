import { View, Text, KeyboardAvoidingView, ScrollView, Platform } from 'react-native'
import React, { Children } from 'react'

const ios = Platform.OS == 'ios'
export default function CustomKeyboardView({children, inChat}) {
    let kavConfig = {};
    let ScrollViewConfig = {};
    if(inChat){
        ScrollViewConfig={contentContainerStyle: {flex: 1}};
        kavConfig={keyboardVerticalOffset: 90};
    }
  return (
    <KeyboardAvoidingView
        behavior={ios? 'padding' : 'height'}
        {...kavConfig}
        style={{flex: 1}}
    >
        <ScrollView
            style={{flex: 1}}
            bounces={false}
            showsVerticalScrollIndicator={false}
            {...ScrollViewConfig}
            
        >
            {
                children
            }
        </ScrollView>
    </KeyboardAvoidingView>
  )
}
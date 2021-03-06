import * as React from 'react';
import { TextInput, TouchableOpacity } from "react-native-gesture-handler";
import { Text } from 'react-native'

import { loginStyles, calendarStyles } from "../presentation/style";

// Creates a custom text input so I can reuse the same styling over and over again. 
export const CustomTextInput = (props) => {
    return (
        <TextInput
            {...props} // Inherit any props passed to it.
            editable
            maxLength={40}
            style={loginStyles.textInput}
            placeholderStyle={{ paddingHorizontal: 100, paddingVertical: 200 }}
        />
    );
}

// Creates a simple customisable app button. Mainly used on the login screen.
export const AppButton = (props) => (
    <TouchableOpacity onPress={props.onPress} style={props.style}>
        <Text style={loginStyles.button}> {props.title} </Text>
    </TouchableOpacity>
);

// Creates the text input for the modal screens.
export const ModalTextInput = (props) => {
    return (
        <TextInput
            {...props} // Inherit any props passed to it.
            editable
            maxLength={40}
            style={calendarStyles.textInput}
            placeholderStyle={{ paddingHorizontal: 100, paddingVertical: 200 }}
        />
    );
}

// Creates unique buttons for each of the modal screens.
export const ModalButton = (props) => (
    <TouchableOpacity onPress={props.onPress} disabled={props.disabled}>
        <Text style={calendarStyles.button}> {props.title} </Text>
    </TouchableOpacity>

);




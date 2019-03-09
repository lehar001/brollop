import React from 'react';
import { TextInput, View, Text } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';

import Input from './Input.js';

class InputWithLabel extends React.Component{
  render() {
    return(
      <View>
        <Text>{this.props.label}</Text>
        <Input
          value={this.props.value}
          onChangeText={this.props.onChangeText}
          autoCorrect={this.props.autoCorrect}
          placeholder={this.props.placeholder}
        />
      </View>
    )
  }
}

export default InputWithLabel;

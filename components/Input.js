import React from 'react';
import { TextInput } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';

class Input extends React.Component{
  render() {
    return(
      <TextInput
        style={styles.input}
        value={this.props.value}
        onChangeText={this.props.onChangeText}
        autoCorrect={this.props.autoCorrect}
        placeholder={this.props.placeholder}
      />
    )
  }
}

export default Input;

const styles = EStyleSheet.create({
  input: {
    backgroundColor: "#eee",
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
  }
});

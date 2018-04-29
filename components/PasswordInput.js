import React from 'react';
import { StyleSheet, TextInput } from 'react-native';

class PasswordInput extends React.Component {

  render() {
    return(
      <TextInput
        style={styles.input}
        value={this.props.value}
        onChangeText={this.props.onChangeText}
        autoCorrect={false}
        autoCapitalize="none"
        keyboardType="default"
        placeholder={this.props.placeholder}
        secureTextEntry={true}
      />
    );
  }

}

export default PasswordInput;

const styles = StyleSheet.create({
  input: {
    backgroundColor: "#eee",
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
  }
})

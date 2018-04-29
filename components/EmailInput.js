import React from 'react';
import { StyleSheet, TextInput } from 'react-native';

class EmailInput extends React.Component {

  render() {
    return(
      <TextInput
        style={styles.input}
        value={this.props.value}
        onChangeText={this.props.onChangeText}
        autoCorrect={false}
        autoCapitalize="none"
        keyboardType="email-address"
        placeholder="Email"
      />
    );
  }

}

export default EmailInput;

const styles = StyleSheet.create({
  input: {
    backgroundColor: "#eee",
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
  }
});

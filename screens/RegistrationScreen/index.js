import React from 'react';
import { StyleSheet, Text, View, TextInput, Button, StatusBar, KeyboardAvoidingView } from 'react-native';

import RegistrationForm from './RegistrationForm';

class RegisterScreen extends React.Component {

  render() {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <KeyboardAvoidingView behavior="position">
          <Text style={styles.title}>Registrera</Text>
          <RegistrationForm navigation={this.props.navigation}/>
        </KeyboardAvoidingView>
      </View>
    );
  }
}

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: "#000",
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center"
  }
});

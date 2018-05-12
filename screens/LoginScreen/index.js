import React from 'react';
import { StyleSheet, Text, View, TextInput, Button, StatusBar, KeyboardAvoidingView } from 'react-native';
import { StackNavigator, NavigationActions, TabNavigator } from 'react-navigation';

import LoginForm from './LoginForm';

class LoginScreen extends React.Component {

  onLoginGoogle = () => {
    var provider = new firebase.auth.GoogleAuthProvider();

  }

  render() {
    const { navigate } = this.props.navigation;

    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <KeyboardAvoidingView behavior="position">
          <Text style={styles.title}>Logga in</Text>
          <LoginForm />
          <Button title="Registrera" onPress={() => navigate('Register')}/>
        </KeyboardAvoidingView>
      </View>
    );
  }
}

export default LoginScreen;

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

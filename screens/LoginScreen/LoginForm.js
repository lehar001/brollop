import React from 'react';
import firebase from 'react-native-firebase';

import { StyleSheet, View, Text, Button, Alert } from 'react-native';

import EmailInput from '../../components/EmailInput';
import PasswordInput from '../../components/PasswordInput';

class LoginForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: ''
    }
  }

  onLogin = () => {

    _resetPassword = (email) => {
      firebase.auth().sendPasswordResetEmail(email).then(function() {
        console.log('Email sent')
      }).catch(function(error) {
        // An error happened.
      });
    }

    const { email, password } = this.state;
    firebase.auth().signInAndRetrieveDataWithEmailAndPassword(email, password)
    .then((user) => {
      // If you need to do anything with the user, do it here
      // The user will be logged in automatically by the
      // `onAuthStateChanged` listener we set up in App.js earlier
    })
    .catch((error) => {
      const { code, message } = error;
      console.log(error);
      if (error.code == 'auth/invalid-email') {
        Alert.alert('Oops', 'Det där är inte en korrekt email')
      }
      if (error.code == 'auth/user-not-found') {
        Alert.alert('Oops', 'Det finns inget konto med denna email')
      }
      if (error.code == 'auth/wrong-password') {
        Alert.alert('Oops', 'Fel lösenord',[
            {text: 'Återställ lösenord', onPress: (email) => _resetPassword(email)},
            {text: 'Försök igen', onPress: () => console.log(this)},
          ],
        );
        this.setState({
          password: ''
        });
      }
      if (error.code == 'auth/user-disabled') {
        Alert.alert('Avstängd användare', 'Detta konto är avstängt.')
      }
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <EmailInput
          value={this.state.email}
          onChangeText={(email) => this.setState({email})}
        />
        <PasswordInput
          value={this.state.password}
          placeholder={'Lösenord'}
          onChangeText={(password) => this.setState({password})}
        />
        <Button
          title="Logga in"
          onPress={() => this.onLogin()}
        />
      </View>
    );
  }
}

export default LoginForm;

const styles = StyleSheet.create({

});

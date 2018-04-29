import React from 'react';
import firebase from 'react-native-firebase';

import { View, StyleSheet, Text, TextInput, Button, Alert } from 'react-native';

import EmailInput from '../../components/EmailInput';
import PasswordInput from '../../components/PasswordInput';

class RegistrationForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      repeatPassword: ''
    }
  }

  // Register new user
  onRegister = () => {
  const { email, password, repeatPassword } = this.state;

  if (email && password) {
    if (password === repeatPassword) {
      firebase.auth().createUserAndRetrieveDataWithEmailAndPassword(email, password)
        .then((user) => {
          this.props.navigation.goBack();
          // If you need to do anything with the user, do it here
          // The user will be logged in automatically by the
          // `onAuthStateChanged` listener we set up in App.js earlier
        })
        .catch((error) => {
          const { code, message } = error;
          console.log(code);
          if (code == 'auth/weak-password') {
            alert('Lösenordet måste vara minst 6 tecken');
            this.setState({
              password: '',
              repeatPassword: '',
            });
          }
          if (code == 'auth/email-already-in-use') {
            Alert.alert('Kontot finns redan', 'Ett konto finns redan registrerad på ' + this.state.email);
          }
          if (code == 'auth/invalid-email') {
            Alert.alert('Felaktig email', 'Vänligen ange en korrekt epostadress');
          }

        });
    } else {
      Alert.alert('Hoppsan', 'Lösenorden matchar inte, försök igen');
      this.setState({
        repeatPassword: '',
      });
    }
  } else {
    Alert.alert('Hoppsan', 'Du har glömt fylla i ett fält');
  }
}

  render() {
    const { goBack } = this.props.navigation;

    return (
      <View>
        <EmailInput
          value={this.state.email}
          onChangeText={(email) => this.setState({email})}
        />
        <PasswordInput
          value={this.state.password}
          placeholder={'Lösenord'}
          onChangeText={(password) => this.setState({password})}
        />
        <PasswordInput
          value={this.state.repeatPassword}
          placeholder={'Upprepa lösenord'}
          onChangeText={(repeatPassword) => this.setState({repeatPassword})}
        />
        <Button
          title="Registrera"
          onPress={() => this.onRegister()}
        />
        <Button
          title="Avbryt"
          onPress={() => goBack()}
        />
      </View>
    );
  }

}

export default RegistrationForm;

const styles = StyleSheet.create({

});

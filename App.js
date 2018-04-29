import React from 'react';
import { StyleSheet, Platform, Image, Text, View, Button } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';

import firebase from 'react-native-firebase';

import { LoginStack, MainTabs, IntroStack } from './config/router';

EStyleSheet.build({ // always call EStyleSheet.build() even if you don't use global variables!
  $primaryColor: 'teal'
});

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: true,
    };
  }

  // Check to see if user is logged in or not.
  // Also listen for changes if user logs in.
  componentDidMount() {
    this.authSubscription = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        const uid = user._user.uid;
        const db = firebase.firestore();

        db.collection('weddings').doc(uid).onSnapshot((wedding) => {
          this.setState({
            loading: false,
            wedding: wedding.data(),
            loggedIn: true
          });
        });
      } else {
        this.setState({
          loading: false,
          loggedIn: false
        });
      }
    });
  }
  // Stop listening for changes when component is about to unmount
  componentWillUnmount() {
    console.log('Component unmounting');
    this.authSubscription();
  }

  render() {
    // The application is initialising
    if (this.state.loading) return null;
    // User is logged in and has wedding data - got to main screen
    if (this.state.loggedIn && this.state.wedding) return (<MainTabs />);
    // The user is logged in but doesn't have a wedding, go to intro screen
    if (this.state.loggedIn) return ( <IntroStack /> );
    // The user is null, so they're logged out
    return <LoginStack />;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  }
});

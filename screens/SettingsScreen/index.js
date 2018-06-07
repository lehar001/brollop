import React from 'react';
import { View, Text, Button, TextInput } from 'react-native';
import firebase from 'react-native-firebase';
import DatePicker from 'react-native-datepicker';
import Input from '../../components/Input';

class SettingsScreen extends React.Component {

  constructor() {
    super();
    this.state = {
      wedding: '',
    }
  }

  componentDidMount() {
    const db = firebase.firestore();
    const uid = firebase.auth().currentUser.uid;

    db.collection("weddings").doc(uid).get().then((snapshot) => {
      const wedding = snapshot.data();
      this.setState({
        name1: wedding.name1,
        name2: wedding.name2,
        date: wedding.date,
        budget: wedding.budget,
      });
    });
  }

  onLogout = () => {
    // Before signing out, unsubscribe to not cause errors
    const db = firebase.firestore();
    const uid = firebase.auth().currentUser.uid;
    var unsubscribe = db.collection("weddings").onSnapshot(() => {});
    unsubscribe();
    // Sign out
    firebase.auth().signOut();
  }

  onSave = () => {

    // Function to convert names to Genitive (ägande)
    function genitiveName(name) {
      if (!(name.slice(-1) == 's' || name.slice(-1) == 'x' || name.slice(-1) == 'z')) {
        return name += 's';
      }
      return name;
    }

    const db = firebase.firestore();
    const uid = firebase.auth().currentUser.uid;
    const {goBack} = this.props.navigation;

    // Set convert name to genitive
    var name1Genitive = genitiveName(this.state.name1);
    var name2Genitive = genitiveName(this.state.name2);

    db.collection("weddings").doc(uid).set({
      name1: this.state.name1,
      name2: this.state.name2,
      date: this.state.date,
      name1Genitive: name1Genitive,
      name2Genitive: name2Genitive,
      budget: this.state.budget
    });
    goBack();

  }

  render() {
    return(
      <View>
        <Text>Brudparets namn</Text>
        <Input
          value={this.state.name1}
          onChangeText={(text) => {this.setState({name1: text})}}
          autoCorrect={false}
          placeholder={"Namn"}
        />
        <Text>&</Text>
        <Input
          value={this.state.name2}
          onChangeText={(text) => {this.setState({name2: text})}}
          autoCorrect={false}
          placeholder={"Namn"}
        />
        <DatePicker
          date={this.state.date}
          mode="date"
          placeholder="Välj datum"
          format="YYYY-MM-DD"
          minDate="2016-05-01"
          maxDate="2025-01-01"
          confirmBtnText="Välj"
          cancelBtnText="Avbryt"
          showIcon={false}
          onDateChange={(date) => {this.setState({date: new Date(date)})}}
        />
        <Text>Vad har ni för budget?</Text>
        <TextInput
          value={`${this.state.budget}`}
          onChangeText={(text) => {
            if(text === ""){
              this.setState({budget: 0})
                return;
            }
            if(isNaN(text))  //this will allow only number
                return;
            this.setState({budget: parseInt(text)})}
          }
          keyboardType="numeric"
        />
        <Button title="Spara" onPress={() => this.onSave()} />
        <Button title="Logga ut" color={'tomato'} onPress={() => this.onLogout()} />
      </View>
    )
  }
}

export default SettingsScreen;

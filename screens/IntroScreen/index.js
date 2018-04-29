import React from 'react';
import firebase from 'react-native-firebase';
import DatePicker from 'react-native-datepicker';
import Swiper from 'react-native-swiper';

import { View, StyleSheet, Text, TextInput, Button } from 'react-native';

class IntroScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      name1: '',
      name2: '',
      date: new Date()
    };
  }
  render() {

    // Function to convert names to Genitive (ägande)
    function genitiveName(name) {
      if (!(name.slice(-1) == 's' || name.slice(-1) == 'x' || name.slice(-1) == 'z')) {
        return name += 's';
      }
      return name;
    }

    onSave = () => {
      const db = firebase.firestore().collection('weddings');
      const uid = firebase.auth().currentUser.uid;

      // Set convert name to genitive
      var name1Genitive = genitiveName(this.state.name1);
      var name2Genitive = genitiveName(this.state.name2);

      db.doc(uid).set({
        date: new Date(this.state.date),
        name1: this.state.name1,
        name2: this.state.name2,
        name1Genitive: name1Genitive,
        name2Genitive: name2Genitive
      });
    }

    return(

      <Swiper ref='swiper' style={styles.wrapper} showsButtons={false}>
        <View>
          <Text>Välkommen till den superbra bröllopsappen!</Text>
          <Text>Den kan göra en massa saker, t.ex. A och B.</Text>
          <Text>Börja med att fylla i de uppgifter ni redan vet!</Text>
          <Button onPress={() => this.refs.swiper.scrollBy(1)} title="Kom igång!"/>
        </View>
        <View>
          <Text style={styles.title}>Skapa ert bröllop</Text>
          <Text>Vad heter brudparet?</Text>
          <TextInput
            style={styles.input}
            placeholder="Person 1"
            autoCorrect={false}
            value={this.state.name1}
            onChangeText={(name1) => {this.setState({name1})}}
          />
          <Text>&</Text>
          <TextInput
            style={styles.input}
            placeholder="Person 2"
            autoCorrect={false}
            value={this.state.name2}
            onChangeText={(name2) => {this.setState({name2})}}
          />
          <Text>När ska brölloppet äga rum?</Text>
          <DatePicker
            style={styles.input}
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
          <Button title="Spara" onPress={() => onSave()} />
        </View>
      </Swiper>
    );
  }

}

export default IntroScreen;

const styles = StyleSheet.create({
  input: {
    backgroundColor: "#eee",
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
  },
  title: {
    color: "#000",
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
  }
});

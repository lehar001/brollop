import React from 'react';
import firebase from 'react-native-firebase';
import Swipeout from 'react-native-swipeout';
import SegmentedControlTab from 'react-native-segmented-control-tab';
import Icon from 'react-native-vector-icons/Ionicons';
import EStyleSheet from 'react-native-extended-stylesheet';
import { SearchBar } from 'react-native-elements'

import { View, Text, FlatList, Button, TouchableHighlight, ActivityIndicator } from 'react-native';

class GuestList extends React.Component {

  static navigationOptions = ({ navigation, screenProps }) => ({
    headerRight: <Icon.Button name="ios-person-add-outline" color={EStyleSheet.value('$primaryColor')} size={28} backgroundColor="rgba(255,255,255,0)" onPress={()=>{ navigation.navigate('NewGuest'); }} />,
  });

  constructor() {
    super();
    this.state = {
      guests: '',
      totalGuests: 0,
      attendingGuests: 0,
      notAttendingGuests: 0,
      notAnsweredGuests: 0,
      selectedIndex: 0,
    }
  }

  filterGuests = (status, guests) => {
     var filteredGuests = guests.filter(function(guest){
        return guest.status == status;
     }).map(function(guest){
         return guest;
     });
     this.setState({
       filteredGuests: filteredGuests,
       allGuests: guests,
     });
   }

  componentDidMount() {
    const uid = firebase.auth().currentUser.uid;
    const db = firebase.firestore();

    db.collection("weddings").doc(uid).collection("guests").orderBy('name').onSnapshot((querySnapshot) => {
        var guests = [];
        var totalGuests = 0;
        var attendingGuests = 0;
        var notAttendingGuests = 0;
        var notAnsweredGuests = 0;
        querySnapshot.forEach(function(doc) {
          const { name, status, extra, kids } = doc.data();
            guests.push({
              key: doc.id,
              name,
              status,
              extra,
              kids
            });
            totalGuests = totalGuests + 1 + extra;
            if (status == "attending") {
              attendingGuests += 1 + extra;
            } else if (status == "notAttending") {
              notAttendingGuests += 1 + extra;
            } else if (status == "noAnswer") {
              notAnsweredGuests += 1 + extra;
            }
        });
        db.collection("weddings").doc(uid).set({
          totalGuests: totalGuests,
          attendingGuests: attendingGuests,
          notAnsweredGuests: notAnsweredGuests,
          notAttendingGuests: notAttendingGuests
        }, {
          merge: true
        });
        if (this.state.selectedIndex == 0) {
          this.setState({
            allGuests: guests,
            filteredGuests: guests,
            totalGuests,
            notAttendingGuests,
            notAnsweredGuests,
            attendingGuests,
          });
        } else {

          if (this.state.selectedIndex == 1) {
            this.filterGuests("attending", guests);
          } else if (this.state.selectedIndex == 2) {
            this.filterGuests("notAttending", guests);
          } else if (this.state.selectedIndex == 3) {
            this.filterGuests("noAnswer", guests);
          }
        }

    });
  }

  // Each time the component is updated it means the guest list has changed.
  // Therefore we will update the budget items that rely on the guest list
  // Next state contains the state after the update, this is what we want
  componentWillUpdate(nextProps, nextState){
    const db = firebase.firestore();
    const uid = firebase.auth().currentUser.uid;
    // Get all budget items where quantity type is greater than 0 (not manual)
    db.collection("weddings").doc(uid).collection("budget").where("quantityTypeIndex", ">", 0).get().then((querySnapshot) => {
      querySnapshot.forEach(function(doc) {

        updateBudgetItem = (typeOfGuests) => {
          var quantity = nextState[typeOfGuests];
          var amount = doc.data().unitPrice * quantity;
          db.collection("weddings").doc(uid).collection("budget").doc(doc.id).set({
            quantity: quantity,
            amount: amount
          }, {
            merge: true
          });
        }
        // 2 = all invited
        if (doc.data().quantityTypeIndex == 2) {
          updateBudgetItem("totalGuests");
        } else if (doc.data().quantityTypeIndex == 1) {
          updateBudgetItem("attendingGuests");
        }
      });
    });
  }

  componentWillUnmount() {
    const db = firebase.firestore();
    var unsubscribe = db.collection("weddings").onSnapshot(() => {});
    unsubscribe();
  }

  beginSearch = (text) => {
    if (this.state.selectedIndex == 0) {
      var allGuests = this.state.allGuests;
    } else {
      var allGuests = this.state.filteredGuests;
    }
    var string = text.toUpperCase();
    //var allGuests = this.state.allGuests;
    var filteredGuests = allGuests.filter(function(guest){
      var name = guest["name"].toUpperCase();
      return name.includes(string);
    }).map(function(guest){
        return guest;
    });
    this.setState({
      filteredGuests
    });
    if (string.length == 0) {
      if (this.state.selectedIndex == 1) {
        this.filterGuests("attending", this.state.allGuests);
      } else if (this.state.selectedIndex == 2) {
        this.filterGuests("notAttending", this.state.allGuests);
      } else if (this.state.selectedIndex == 3) {
        this.filterGuests("noAnswer", this.state.allGuests);
      } else {
       this.setState({
         filteredGuests: this.state.allGuests,
       });
     }
    }
  }

  clearSearch = () => {
    var allGuests = this.state.allGuests;
    this.setState({
      filteredGuests: allGuests,
    });
  }

  handleIndexChange = (index) => {
    this.setState({
      selectedIndex: index,
    });


     if (index == 1) {
       this.filterGuests("attending", this.state.allGuests);
     } else if (index == 2) {
       this.filterGuests("notAttending", this.state.allGuests);
     } else if (index == 3) {
       this.filterGuests("noAnswer", this.state.allGuests);
     } else {
      this.setState({
        filteredGuests: this.state.allGuests,
      });
    }

  }

  _renderEmptyList = () => {
    if (this.state.totalGuests == 0) {
      return (
        <View>
          <Text>Du verkar inte ha lagt till några gäster</Text>
          <Button title="Lägg till gäst" onPress={()=>{ this.props.navigation.navigate('NewGuest'); }} />
        </View>
      )
    } else {
      return (
        <View>
          <Text>Inga gäster här</Text>
        </View>
      )
    }
  }

  renderItem(guest) {

    onGuestDelete = (guest) => {
      const uid = firebase.auth().currentUser.uid;
      const db = firebase.firestore().collection("weddings").doc(uid);

      db.collection("guests").doc(guest.item.key).delete();
    }

    onAttending = (guest) => {
      const uid = firebase.auth().currentUser.uid;
      const db = firebase.firestore().collection("weddings").doc(uid);

      db.collection("guests").doc(guest.item.key).update({
        status: 'attending'
      });
    }

    onNotAttending = (guest) => {
      const uid = firebase.auth().currentUser.uid;
      const db = firebase.firestore().collection("weddings").doc(uid);

      db.collection("guests").doc(guest.item.key).update({
        status: 'notAttending'
      });
    }

    // Swipe buttons
    let swipeBtns = [
      {
        text: 'Kommer',
        backgroundColor: 'green',
        onPress: () => {onAttending(guest)}
      },
      {
        text: 'Kommer inte',
        backgroundColor: 'yellow',
        onPress: () => {onNotAttending(guest)}
      },
      {
      text: 'Ta bort',
      backgroundColor: 'red',
      underlayColor: 'rgba(0, 0, 1, 0.6)',
      onPress: () => {onGuestDelete(guest)}
    }];

    // Define styles depending on status
    if (guest.item.status == 'attending') {
      var style = styles.attending;
    } else if (guest.item.status == 'notAttending') {
      var style = styles.notAttending;
    }

    return (
      <Swipeout autoClose={true} right={swipeBtns} backgroundColor={"transparent"}>
        <TouchableHighlight style={[styles.itemContainer, style]} onPress={ () => { this.props.navigation.navigate('NewGuest', {guest: guest})}}>
          <View>
            <View>
              <Text style={styles.itemTitle}>{guest.item.name}</Text>
            </View>
              {guest.item.extra > 0 &&
                <View>
                  <Text>+{guest.item.extra}</Text>
                </View>
              }
              {guest.item.kids > 0 &&
                <View>
                  <Text>{guest.item.kids}</Text>
                </View>
              }
            </View>
          </TouchableHighlight>
      </Swipeout>
    )
  } // End renderItem

  render() {
    return (
      <View>
        <SegmentedControlTab
          values={['Alla','Tackat ja','Tackat nej', 'Ej svarat']}
          selectedIndex={this.state.selectedIndex}
          onTabPress={this.handleIndexChange}
        />
        <Text>Antal inbjudna: {this.state.totalGuests}</Text>
        <Text>Tackat ja: {this.state.attendingGuests}</Text>
        <Text>Tackat nej: {this.state.notAttendingGuests}</Text>
        <Text>Ej svarat: {this.state.notAnsweredGuests}</Text>
        <SearchBar
          onChangeText={(text) => this.beginSearch(text)}
          onClear={() => this.clearSearch()}
          placeholder='Sök gäst...'
        />
        <FlatList
          style={styles.flatList}
          data={this.state.filteredGuests}
          renderItem={this.renderItem.bind(this)}
          keyExtractor={(item, index) => index.toString()}
          ListEmptyComponent={this._renderEmptyList()}
        />
      </View>
    );
  }
}

export default GuestList;

const styles = EStyleSheet.create({
  flatList: {

  },
  itemContainer: {
    backgroundColor: "#FFFFFF",
    paddingLeft: 10,
    borderBottomWidth: 0,
    flex: 1,
    flexDirection: "row",
    height: 55,
    alignItems: 'center',
    borderLeftWidth: 5,
    borderLeftColor: 'rgba(255,255,255,0)',
    marginLeft: 5,
    marginRight: 5,
    marginBottom: 2.5,
    marginTop: 2.5,
    borderRadius: 5
  },
  itemTitle: {
    fontSize: 18,
  },
  attending: {
    borderLeftWidth: 5,
    borderLeftColor: "#6FCF97",
  },
  notAttending: {
    borderLeftWidth: 5,
    borderLeftColor: "#EB5757",
  }
});

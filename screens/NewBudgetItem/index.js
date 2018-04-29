import React from 'react';
import firebase from 'react-native-firebase';
import { View, Text, Button, TextInput, Alert } from 'react-native';
import ModalDropdown from 'react-native-modal-dropdown';
import Input from '../../components/Input';
import EStyleSheet from 'react-native-extended-stylesheet';

class NewBudgetItem extends React.Component {

  constructor() {
    super();
    this.state = {
      name: '',
      unitPrice: '',
      quantityTypeIndex: 0,
      quantityTypeValue: 'Ange själv',
      quantity: 1,
      amount: '',
      isNew: true,
      editableQuantity: true,
    }
  }

  static navigationOptions = ({navigation}) => {
    if (navigation.state.params) {
        return {title: navigation.state.params.item.item.name}
    }
    return {title: 'Ny kostnad'}
  }

  componentDidMount() {
    // Check if this is a new user or an editing
    if (this.props.navigation.state.params !== undefined) {
      const item = this.props.navigation.state.params.item.item;
      const amount = item.unitPrice * item.quantity;

      // Set dropdown to reflect quantity type
      this.dropdown.select(item.quantityTypeIndex);

      // Makes sure users can't edit quantity if it's not set to index 0
      var editableQuantity = true;
      if (item.quantityTypeIndex != 0) {
        editableQuantity = false;
      }

      this.setState({
        name: item.name,
        unitPrice: item.unitPrice,
        quantity: item.quantity,
        amount: amount,
        editableQuantity: editableQuantity,
        isNew: false
      });
    }
  }

  render() {

    onNew = () => {
      if (this.state.name && this.state.unitPrice) {
        const db = firebase.firestore();
        const uid = firebase.auth().currentUser.uid;
        const { goBack } = this.props.navigation;

        db.collection("weddings").doc(uid).collection("budget").add({
          name: this.state.name,
          unitPrice: this.state.unitPrice,
          quantityTypeIndex: this.state.quantityTypeIndex,
          quantity: this.state.quantity,
          amount: this.state.amount,
        });

        goBack();
      } else {
        Alert.alert('Oops', 'Du måste fylla i namn och pris');
      }
    }

    onDelete = () => {
      const db = firebase.firestore();
      const uid = firebase.auth().currentUser.uid;
      const { goBack } = this.props.navigation;
      const key = this.props.navigation.state.params.item.item.key;

      db.collection("weddings").doc(uid).collection("budget").doc(key).delete();

      goBack();
    }

    onUpdate = () => {
      if (this.state.name && this.state.unitPrice) {
        const db = firebase.firestore();
        const uid = firebase.auth().currentUser.uid;
        const key = this.props.navigation.state.params.item.item.key;
        const { goBack } = this.props.navigation;

        db.collection("weddings").doc(uid).collection("budget").doc(key).set({
          name: this.state.name,
          unitPrice: this.state.unitPrice,
          amount: this.state.amount,
          quantity: this.state.quantity,
          quantityTypeIndex: this.state.quantityTypeIndex,
        });

        goBack();
      } else {
        Alert.alert('Oops', 'Du måste fylla i namn och pris');
      }
    }

    onAmountUpdate = (value) => {
      var amount = value * this.state.quantity;
      this.setState({
        unitPrice: value,
        amount: amount
      });
    }

    onquantityUpdate = (quantity) => {
      var amount = quantity * this.state.unitPrice;
      this.setState({
        quantity: quantity,
        amount: amount
      });
    }

    onQuantityTypeUpdate = (index) => {
      var db = firebase.firestore();
      var uid = firebase.auth().currentUser.uid;

      calculateAmount = (typeOfGuests) => {
        db.collection("weddings").doc(uid).get().then((doc) => {
          var data = doc.data();
          var quantity = doc.data()[typeOfGuests];
          console.log(quantity);
          var amount = quantity * this.state.unitPrice;
          this.setState({
            quantity: quantity,
            amount: amount
          });
        });
      }

      // 2 = number of invited
      if (index == 2) {
        calculateAmount("totalGuests");
      } else if (index == 1) {
        // 1 = number of attending guests
        calculateAmount("attendingGuests");
      }
    }

    onSelectQuantityType = (index, value) => {
      // If any automatic quantity option is selected, disable editing
      if (index != 0) {
        this.setState({editableQuantity: false, quantityTypeIndex: parseInt(index)});
        onQuantityTypeUpdate(index);
      } else {
        this.setState({editableQuantity: true, quantityTypeIndex: parseInt(index)});
      }
    }

    return(
      <View>
        <Text>Namn</Text>
        <Input
          value={this.state.name}
          onChangeText={(name) => {this.setState({name})}}
          autoCorrect={false}
          placeholder={"Namn"}
        />
        <Text>Kostnad</Text>
        <TextInput
          value={`${this.state.unitPrice}`}
          onChangeText={(text) => {
            if(text === ""){
                onAmountUpdate('');
                return;
            }
            if(isNaN(text))    //this will allow only number
                return;
            onAmountUpdate(parseInt(text))}
          }
          keyboardType="numeric"
        />
        <Text>Antal</Text>
        <ModalDropdown
          ref={(ref) => this.dropdown = ref}
          options={['Ange själv', 'Antal gäster', 'Antal inbjudna',]}
          defaultIndex={this.state.quantityTypeIndex}
          defaultValue={this.state.quantityTypeValue}
          onSelect={(index, value) => onSelectQuantityType(index, value)}
        />
        <TextInput
          // conditional styles as seen http://www.terrydiederich.com/changing-style-as-state-changes-in-react-native/
          style={[styles.inactive, this.state.editableQuantity && styles.active]}
          value={`${this.state.quantity}`}
          editable={this.state.editableQuantity}
          keyboardType="numeric"
          onChangeText={(quantity) => {
            if(quantity === "") {
              onquantityUpdate('');
              return;
            }
            if(isNaN(quantity))
              return
            onquantityUpdate(parseInt(quantity))}
          }
        />
        <Text>Totalt: {this.state.amount}</Text>
        {this.state.isNew ? (
            <Button title="Lägg till kostnad" onPress={() => onNew()}/>
        ) : (
          <View>
            <Button title="Uppdatera" onPress={() => onUpdate()}/>
            <Button title="Ta bort" color={"tomato"} onPress={() => onDelete()} />
          </View>
        )}
      </View>
    )
  }
}

export default NewBudgetItem;

const styles = EStyleSheet.create({
  active: {
    backgroundColor: "#F5F5F5",
  },
  inactive: {
    backgroundColor: "red",
  }
});

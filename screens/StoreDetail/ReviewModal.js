import React from 'react';
import { Button, Text, TextInput, Modal, View, Alert } from 'react-native';
import firebase from 'react-native-firebase';
import EStyleSheet from 'react-native-extended-stylesheet';
import StarRating from 'react-native-star-rating';


class ReviewModal extends React.Component {

  constructor() {
    super();
    this.state={
      rating: 0,
      review: '',
      writer: ''
    };
  }

  onStarRatingPress(rating) {
    this.setState({
      rating: rating
    });
  }

  onSaveReview = () => {
    if (this.state.rating == 0 || this.state.review == '') {
      Alert.alert('Oops', 'Du måste välja ett betyg och skriva en recension');
    } else {
      const db = firebase.firestore();
      const uid = firebase.auth().currentUser.uid;

      db.collection("weddings").doc(uid).get().then(function(doc) {
         var writer = doc.data().name1 + ' & ' + doc.data().name2;
         saveReview(writer);
      });

     saveReview = (writer) => {
        db.collection("stores").doc(this.props.store.category).collection("items").doc(this.props.store.key).collection("reviews").add({
          rating: this.state.rating,
          review: this.state.review,
          writer: writer,
          created: new Date(),
        });
        this.props.setModalVisible();
      }

    }
  }

  render() {
    var store = this.props.store;
    return(

      <Modal
        animationType="slide"
        transparent={false}
        visible={this.props.visible}
      >
        <View style={{marginTop: 22}}>
          <View>
            <Text>Skriv en recension om {store.name}</Text>
            <StarRating
              disabled={false}
              emptyStar={'ios-star-outline'}
              fullStar={'ios-star'}
              halfStar={'ios-star-half'}
              iconSet={'Ionicons'}
              maxStars={5}
              rating={this.state.rating}
              selectedStar={(rating) => this.onStarRatingPress(rating)}
              fullStarColor={'red'}
            />
            <TextInput
              style={styles.multilineInput}
              multiline={true}
              onChangeText={(text) => this.setState({review: text})}
            />
            <Button
              title="Avbryt"
              color={"tomato"}
              onPress={this.props.setModalVisible}
            />
            <Button
              title="Spara"
              onPress={() => this.onSaveReview()}
            />
          </View>
        </View>
      </Modal>
    )
  }
}

export default ReviewModal;

const styles = EStyleSheet.create({
  multilineInput: {
    backgroundColor: "#F5F5F5",
  }
});

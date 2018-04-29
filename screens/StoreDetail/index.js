import React from 'react';
import { View, Text, FlatList, Button, Modal, TouchableHighlight } from 'react-native';
import firebase from 'react-native-firebase';
import ReviewModal from './ReviewModal';
import StarRating from 'react-native-star-rating';

class StoreDetail extends React.Component {

  static navigationOptions = ({navigation}) => {
    return {title: navigation.state.params.store.store.name}
  }

  constructor() {
    super();
    this.state = {
      reviews: '',
      modalVisible: false,
    }
  }

  componentDidMount() {
     const storeKey = this.props.navigation.state.params.store.key;
     const category = this.props.navigation.state.params.store.category;
     const db = firebase.firestore().collection("stores").doc(category).collection("items").doc(storeKey).collection("reviews");
     db.onSnapshot((querySnapshot) => {
       var reviews = [];
       querySnapshot.forEach(function(doc) {
         const { review, rating, writer, created} = doc.data();
         reviews.push({
           review,
           rating,
           writer,
           created
         });
       });
       this.setState({
         reviews: reviews,
       });
     });
  }

  renderReview(review) {
    console.log(review);
    return(
      <View>
        <StarRating
          disabled={true}
          emptyStar={'ios-star-outline'}
          fullStar={'ios-star'}
          halfStar={'ios-star-half'}
          iconSet={'Ionicons'}
          maxStars={5}
          rating={review.item.rating}
          selectedStar={null}
          fullStarColor={'red'}
        />
        <Text>{review.item.review}</Text>
        <Text>Av: {review.item.writer}</Text>
      </View>
    );
  }

  _renderEmptyReviewList() {
    return(
      <View>
        <Text>Oj, inga omdömen än</Text>
      </View>
    );
  }

  setModalVisible = (visible) => {
    this.setState({modalVisible: visible});
  }

  render() {
    var store = this.props.navigation.state.params.store;
    return(
      <View>
        <ReviewModal
          store={store}
          setModalVisible={() => {this.setModalVisible(!this.state.modalVisible);}}
          visible={this.state.modalVisible}
        />
        <View>
          <StarRating
            disabled={true}
            emptyStar={'ios-star-outline'}
            fullStar={'ios-star'}
            halfStar={'ios-star-half'}
            iconSet={'Ionicons'}
            maxStars={5}
            rating={store.store.rating}
            selectedStar={null}
            fullStarColor={'red'}
          />
          <Text>This store has a rating of {store.store.rating}</Text>
        </View>
        <Text>Omdömen</Text>
        <FlatList
          data={this.state.reviews}
          renderItem={this.renderReview.bind(this)}
          keyExtractor={(item, index) => index.toString()}
          ListEmptyComponent={this._renderEmptyReviewList()}
        />
        <Button
          title="Skriv ett omdöme"
          onPress={() => {this.setModalVisible(!this.state.modalVisible);}}/>
      </View>
    )
  }
}

export default StoreDetail;

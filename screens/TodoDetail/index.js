import React from 'react';
import {Text, View, Button} from 'react-native';
import firebase from 'react-native-firebase';

class TodoDetail extends React.Component {

  constructor() {
    super();
    this.state = {
      isCompleted: false,
    }
  }

  componentDidMount(){
    // Function to check if array contains value from https://stackoverflow.com/questions/1181575/determine-whether-an-array-contains-a-value
    var contains = function(needle) {
      // Per spec, the way to identify NaN is that it is not equal to itself
      var findNaN = needle !== needle;
      var indexOf;

      if(!findNaN && typeof Array.prototype.indexOf === 'function') {
          indexOf = Array.prototype.indexOf;
      } else {
          indexOf = function(needle) {
              var i = -1, index = -1;

              for(i = 0; i < this.length; i++) {
                  var item = this[i];

                  if((findNaN && item !== item) || item === needle) {
                      index = i;
                      break;
                  }
              }

              return index;
          };
      }

      return indexOf.call(this, needle) > -1;
    };

    // Check if todo is completed
    const uid = firebase.auth().currentUser.uid;
    var isCompleted = contains.call(this.props.navigation.state.params.todo.todo.completed, uid);
    console.log(isCompleted);
    this.setState({
      isCompleted,
    });
  }

  render() {
    var todo = this.props.navigation.state.params.todo;

    onSetDone = () => {
      const db = firebase.firestore();
      const doc = db.collection("todos").doc(todo.key);
      const uid = firebase.auth().currentUser.uid;

      return db.runTransaction(transaction => {
        return transaction.get(doc).then(snapshot => {
          var completed = snapshot.data().completed;
          if (completed !== undefined) {
            completed.push(uid);
            transaction.update(doc, 'completed', completed);
          } else {
            completed =[];
            completed.push(uid);
            transaction.update(doc, 'completed', completed);
          }
          this.setState({
            isCompleted: true,
          })
        });
      });
    }

    onSetNotDone = () => {
      const db = firebase.firestore();
      const doc = db.collection("todos").doc(todo.key);
      const uid = firebase.auth().currentUser.uid;

      return db.runTransaction(transaction => {
        return transaction.get(doc).then(snapshot => {
          var completed = snapshot.data().completed;
          var index = completed.indexOf(uid);
          if (index > -1) {
            completed.splice(index, 1);
          }
          transaction.update(doc, 'completed', completed);
          this.setState({
            isCompleted: false,
          })
        });
      });
    }

    return(
      <View>
        <Text>{todo.todo.title}</Text>
        <Text>Deadline: {todo.todoDate}</Text>
        {this.state.isCompleted ? (
            <Button title="Markera som ej avklarad" color="tomato" onPress={() => onSetNotDone()}/>
        ) : (
            <Button title="Markera som avklarad" onPress={() => onSetDone()}/>
        )}
      </View>
    )
  }
}

export default TodoDetail;

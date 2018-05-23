const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

exports.calculateRating = functions.firestore
  .document('stores/{category}/items/{storeId}/reviews/{reviewId}')
  .onWrite((change, context) => {
    console.log("Rating calculation started...")
    // Get an object with the current document value.
    // If the document does not exist, it has been deleted.
    const document = change.after.exists ? change.after.data() : null;

    const updatedReview = change.after.exists && change.before.exists ? true : false;

    // Get an object with the previous document value (for update or delete)
    const oldDocument = change.before.data();

    const storeRef = admin.firestore().collection('stores').doc(context.params.category).collection('items').doc(context.params.storeId);

    // If rating hasn't changed, don't do anything
      return storeRef.get().then(function(doc) {
         var currentRating = doc.data().rating;
         var currentReviews = doc.data().reviews;
         console.log('Current rating is ' + currentRating);
         console.log('Current reviews is ' + currentRating);

         // How to handle updates?
         if (document !== null && currentReviews === undefined) {
           // This is a brand new review
           var newReviews = 1;
           var newRating = document.rating;
         } else if (document !== null && updatedReview === false) {
           // This is an added review
            newReviews = currentReviews + 1;
            newRating = ((currentReviews * currentRating) + document.rating) / newReviews;
         } else if (document === null) {
           // This is a removed review
           newReviews = currentReviews - 1;
           newRating = ((currentReviews * currentRating) - oldDocument.rating) / newReviews;
           if (newReviews === 0) {
             newRating = 0;
           }
         } else if (document !== null && updatedReview === true) {
           // This is an updated review
           newReviews = currentReviews;
           newRating = ((currentReviews * currentRating) - oldDocument.rating + document.rating) / newReviews;
         }

         console.log('New rating is ' + newRating + ' with a total of ' + newReviews + ' reviews');

         return storeRef.update({
           rating: newRating,
           reviews: newReviews
         });
      }).catch(function(error) {
        console.log(error);
      });


  });

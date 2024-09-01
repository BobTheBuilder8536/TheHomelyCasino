import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
const firebaseConfig = {
apiKey: "AIzaSyCh_5B5KO57EYr7OfLYeCOCqwo-SsBCUJY",
authDomain: "casino-209.firebaseapp.com",
projectId: "casino-209",
storageBucket: "casino-209.appspot.com",
messagingSenderId: "781705704501",
appId: "1:781705704501:web:1a8d4c1a1e6a2cdd582d7c"
};

const app = initializeApp(firebaseConfig);

import {getDatabase, ref,onValue, child, get, set, update, remove} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-database.js";

var pName = "Prateek";
var matchData;
const db = child(ref(getDatabase()),'Round/');
var chaalAmount = 0;
var playerActive = false;
var betInfo = [];

function activate(data){
  betInfo = data[pName].bets;
  chaalAmount = data["RoundData"].chaal;
  playerActive = true;
}


function deactivate(){
    playerActive = false;
}

function playChaal(){
        console.log("Chaal");
}

function playDouble(){
    console.log("Double");
}

function playShow(){
    console.log("Show");
}

function playPack(){
    console.log("Pack");
}



onValue(db,(snapshot) => {
  var dbSnap = snapshot.val();
  if ((dbSnap[pName].playerNum == dbSnap["RoundData"].playingNum) && (dbSnap[pName].packed == false)){
    activate(dbSnap);
    console.log("You are playing");
  } else {
    deactivate();
    console.log("Someone Else is playing");
  }
})

// get(child(db, `Round/`)).then((snapshot) => {
//     if (snapshot.exists()) {
//       matchData = snapshot.val()["RoundData"];
//       console.log(matchData);
//     } else {
//       console.log("No data available");
//     }
// });


    
// while (true) {
        
//     data = await getData('./round.json');
//     console.log(data[0].playingNum);
//     if (data[0].playingNum == playerNum){
//         active();
//         break;
//     }
// }

// console.log(chaalAmount);
// console.log(betInfo);

// document.getElementById("chaal").addEventListener("click",playChaal);
// document.getElementById("double").addEventListener("click",playDouble);
// document.getElementById("show").addEventListener("click",playShow);
// document.getElementById("pack").addEventListener("click",playPack);

// // while (playerActive == true){
// //     // document.getElementById("chaal").addEventListener("click",playChaal());
// // }
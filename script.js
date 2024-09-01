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
const db = child(ref(getDatabase()),'Round/');
var chaalAmount = 0;
var playerActive = false;
var betInfo = [];

function activate(data){
  betInfo = data[pName].bets;
  chaalAmount = data["RoundData"].chaal;
  playerActive = true;
  // console.log(playerActive);
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
    // console.log(playerActive);
    console.log("You are playing");
  } else {
    deactivate();
    console.log("Someone Else is playing");
  }
})


document.getElementById("chaalBut").addEventListener("click", () => {
  if (playerActive){
    playChaal();
  }
});

document.getElementById("doubleBut").addEventListener("click", () => {
  if (playerActive){
    playDouble();
  }
});

document.getElementById("showBut").addEventListener("click", () => {
  if (playerActive){
    playShow();
  }
});

document.getElementById("packBut").addEventListener("click", () => {
  if (playerActive){
    playPack();
  }
});
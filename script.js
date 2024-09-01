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
const db = getDatabase();
var playerID = 0;
var chaalAmount = 0;
var playerActive = false;
var playerList = [];
var betInfo = [];

function activate(data){
  betInfo = data[pName].bets;
  chaalAmount = data["RoundData"].chaal;
  playerID = data[pName].playerNum;
  playerActive = true;
  playerList = data["RoundData"].names;
  // console.log(playerActive);
}

function uiUpdate(){

}

function fbUpdate(amount){
  update(ref(db,'Round/' + pName),{
    bets: betInfo,
    totalBet: betInfo.reduce((a, b) => a + b, 0)
  });
  update(ref(db,'Round/RoundData'),{
    chaal: amount,
    playingNum: playerID+1
  });
}

function deactivate(){
  playerActive = false;
}

function playChaal(){
  console.log("Chaal");
  betInfo.push(chaalAmount);
  fbUpdate(chaalAmount);
  // deactivate();
}

function playDouble(){
  console.log("Double");                                                                                                                                                                                                                                                                                                                                                                                          
  chaalAmount *=2;
  betInfo.push(chaalAmount);
  fbUpdate(chaalAmount);
}

function playShow(){
  betInfo.push(chaalAmount);
  
  // Get previous unpacked player
  update(ref(db,'Round/' + playerList[playerID+1]),{
    showing: true
  });
  
  console.log("Show");
  fbUpdate();
  
}

function playPack(){
  console.log("Pack");
}



onValue(child(ref(db),'Round/'),(snapshot) => {
  var dbSnap = snapshot.val();
  if ((dbSnap[pName].playerNum == dbSnap["RoundData"].playingNum) && (dbSnap[pName].packed == false)){
    activate(dbSnap);
    // console.log(playerActive);
    console.log("You are playing");
  } else {
    deactivate();
    console.log("Someone Else is playing");
  }
});


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
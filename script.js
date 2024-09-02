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

const db = getDatabase();

// function addUser(username){
//   get(ref(db,'Round/')).then((snapshot) => {
//     console.log(snapshot.val());
//     console.log(username);
//     if(username in snapshot.val()){
//       console.log("ok");  
//     } else {

//       var newName = snapshot.val()['RoundData'].names.push(username);

//       update(ref(db,'Round/RoundData'),{
//         names: newName
//       });

//       var id = (snapshot.val()['RoundData'].names.length);
//       set(ref(db,'Round/' + username),{
//         bets: [0],
//         name: username,
//         packed: false,
//         playernum: id,
//         showing: false,
//         totalBet: 0
//       })

//     }
//   });

// }

var pName = "";

document.getElementById("displayName").style.display = "none";

document.getElementById("loginForm").addEventListener("submit",(event)=>{
  event.preventDefault()
  document.getElementById("displayName").innerText = document.getElementById("loginInput").value;
  
  pName = document.getElementById("loginInput").value;
  // addUser(document.getElementById("loginInput").value);

  document.getElementById("loginDiv").style.display = "none";
  document.getElementById("displayName").style.display = "flex";
});


if (pName != ""){
  var playerID = 0;
  var chaalAmount = 0;
  var playerActive = false;
  var nextPlayer = [];
  var previousPlayer = [];
  var betInfo = [];
  var packActive = false;

  function activate(data){
    betInfo = data[pName].bets;
    chaalAmount = data["RoundData"].chaal;
    playerID = data[pName].playerNum;
    playerActive = true;
    packActive = true;
    
    var nameList = data["RoundData"].names;
    
    while (true){
      if ((data[nameList[(playerID == 1) ? playerID = (nameList.length) : --playerID]].packed) == false){
        previousPlayer = [playerID,nameList[playerID]];
        break;
      }
    }
    
    playerID = data[pName].playerNum;
    
    while (true){
      if ((data[nameList[(playerID == (nameList.length)) ? playerID = 1 : ++playerID]].packed) == false){
        nextPlayer = [playerID,nameList[playerID]];
        break;
      }
    }
    
    playerID = data[pName].playerNum;
    
    // console.log("Previous : " + previousPlayer);
    // console.log("Next : " + nextPlayer);
    // console.log(playerActive);
  }
  
  function uiUpdate(){
    document.getElementById("cumBet").innerText = betInfo.reduce((a, b) => a + b, 0);
    
  }
  
  function fbUpdate(amount){
    update(ref(db,'Round/' + pName),{
      bets: betInfo,
      totalBet: betInfo.reduce((a, b) => a + b, 0)
    });
    
    update(ref(db,'Round/RoundData'),{
      chaal: amount,
      playingNum: nextPlayer[0]
    });
  }

  function deactivate(){
    playerActive = false;
    packActive = false;
  }

  function playChaal(){
    console.log("Chaal");
    betInfo.push(chaalAmount);
    
    uiUpdate();
    fbUpdate(chaalAmount);
  }

  function playDouble(){
    console.log("Double");                                                                                                                                                                                                                                                                                                                                                                                          
    chaalAmount *=2;
    betInfo.push(chaalAmount);
    uiUpdate();
    fbUpdate(chaalAmount);
  }

  function playShow(){
    betInfo.push(chaalAmount);
    
    uiUpdate();
    update(ref(db,'Round/' + pName),{
      showing: true
    });
    
    update(ref(db,'Round/' + previousPlayer[1]),{
      showing: true
    });
    
    console.log("Show");
    fbUpdate(chaalAmount);
    
  }

  function playPack(){
    update(ref(db,'Round/' + previousPlayer[1]),{
      showing: false
    });
    
    update(ref(db,'Round/' + pName),{
      packed: true,
      showing: false
    });

    
    update(ref(db,'Round/RoundData/'),{
      playingNum: nextPlayer[0]
    })
    
    console.log("Pack");
  }

  function chaalSound() {
      var audio = new Audio("chaal.mp3");
      audio.play();
    }


  onValue(child(ref(db),'Round/'),(snapshot) => {
    var dbSnap = snapshot.val();
    
    if ((dbSnap[pName].playerNum == dbSnap["RoundData"].playingNum) && (dbSnap[pName].packed == false) && (dbSnap[pName].showing == false)){
      activate(dbSnap);
      // console.log(playerActive);
      console.log("You are playing");

    } else if (dbSnap[pName].showing){
      
      playerActive = false;
      packActive = true;
      console.log("You are showing");

    } else {

      deactivate();
      console.log("Someone Else is playing");
    }
  });


  document.getElementById("chaalBut").addEventListener("click", () => {
    if (playerActive){
      chaalSound();
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
    if (packActive){
      playPack();
    }
  });
}
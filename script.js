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

import {getDatabase, ref, onValue, get, set, update, remove} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-database.js";

const db = getDatabase();

console.log("Connected to Database!");

const pullToRefresh = document.querySelector('.pull-to-refresh');
let touchstartY = 0;
let touchDiff = 0;

document.addEventListener('touchstart', e => {
  touchstartY = e.touches[0].clientY;
});
document.addEventListener('touchmove', e => {
  const touchY = e.touches[0].clientY;
  touchDiff = touchY - touchstartY;
  if (touchDiff > 200) {
    pullToRefresh.classList.add('visible');
    e.preventDefault();
  }
});
document.addEventListener('touchend', e => {
  if (pullToRefresh.classList.contains('visible')) {
    pullToRefresh.classList.remove('visible');
    
    if (touchDiff > 200) {
      location.reload();
    }
  }
});


var pName = "";

function addUser(username){
  get(ref(db,'Round/')).then((snapshot) => {
    // console.log(snapshot.val());
    // console.log(username);

    if (username == "Admin"){

      document.getElementById("adminMove").style.display = "flex";
      document.getElementById("currentRound").style.display = "none";
      document.getElementById("players1").style.display = "none";
      document.getElementById("players2").style.display = "none";
      document.getElementById("chaalBut").style.display = "none";
      document.getElementById("showBut").style.display = "none";
      document.getElementById("doubleBut").style.display = "none";
      document.getElementById("packBut").style.display = "none";

    } else if(username in snapshot.val()){

      console.log("already exists");  

    } else {

      var newName = snapshot.val()['RoundData'].names;
      newName.push(username);

      update(ref(db,'Round/RoundData'),{
        names: newName
      });

      var id = (snapshot.val()['RoundData'].names.length);
      set(ref(db,'Round/' + username),{
        bets: [0],
        name: username,
        packed: false,
        playerNum: id,
        showing: false,
        totalBet: 0
      })

    }
  });
}

document.getElementById("loginForm").addEventListener("submit",(event)=>{
  event.preventDefault()
  document.getElementById("displayName").innerText = document.getElementById("loginInput").value;
  
  pName = document.getElementById("loginInput").value;
  addUser(pName);

  document.getElementById("loginDiv").style.display = "none";
  document.getElementById("displayName").style.display = "flex";

});

var pName = document.getElementById("loginForm").value;
var playerID = 1;
var chaalAmount = 1;
var cumuBet = 0;
var playerActive = false;
var nextPlayer = [];
var previousPlayer = [];
var betInfo = [];
var playerList = [];
var packActive = false;


function startGame(){
  update(ref(db,'Round/RoundData'),{
    playingNum: 1
  });
}

function clearGame(){
  remove(ref(db,'Round/'));

  update(ref(db,'Round/RoundData'),{
      chaal: 1,
      cumBet: 0,
      names: ["Admin"],
      playingNum: 0
  });

}

function activate(data){
  betInfo = data[pName].bets;
  playerID = data[pName].playerNum;
  playerActive = true;
  packActive = true;
  
  var nameList = data["RoundData"].names;
  
  while (true){
    if ((data[nameList[(playerID == 1) ? playerID = (nameList.length-1) : --playerID]].packed) == false){
      previousPlayer = [playerID,nameList[playerID]];
      break;
    }
  }
  
  playerID = data[pName].playerNum;
  
  while (true){
    if ((data[nameList[(playerID == (nameList.length-1)) ? playerID = 1 : ++playerID]].packed) == false){
      nextPlayer = [playerID,nameList[playerID]];
      break;
    }
  }
  
  playerID = data[pName].playerNum;
  
  
  // console.log("Previous : " + previousPlayer);
  // console.log("Next : " + nextPlayer);
  // console.log(playerActive);
}

function checkWin(data){
  
  var nameList = data["RoundData"].names;
  var activePlayers = [];

  // console.log(nameList);

  for(var i = 1; i < nameList.length; i++){
    if(!data[nameList[i]].packed){
      activePlayers.push([i,nameList[i]])
    }
  }
  
  if(activePlayers.length == 1 && data['RoundData'].playingNum != 0){
    if(activePlayers[0][1] == pName && pName != "Admin"){
      
      document.getElementById("currentRound").style.display = "none";
      document.getElementById("players1").style.display = "none";
      document.getElementById("players2").style.display = "none";
      document.getElementById("chaalBut").style.display = "none";
      document.getElementById("showBut").style.display = "none";
      document.getElementById("doubleBut").style.display = "none";
      document.getElementById("packBut").style.display = "none";
      
      document.getElementById("youWin").style.display = "flex";
      document.getElementById("finalPotText").innerText = document.getElementById("myBet").innerText;
      document.getElementById("finalPot").style.display = "flex";
      
    } else if (pName != "Admin"){
      
      document.getElementById("currentRound").style.display = "none";
      document.getElementById("players1").style.display = "none";
      document.getElementById("players2").style.display = "none";
      document.getElementById("chaalBut").style.display = "none";
      document.getElementById("showBut").style.display = "none";
      document.getElementById("doubleBut").style.display = "none";
      document.getElementById("packBut").style.display = "none";
      
      
      
      document.getElementById("youLose").style.display = "flex";
      document.getElementById("finalPotText").innerText = document.getElementById("myBet").innerText;
      document.getElementById("finalPot").style.display = "flex";
      
    }
  }
}

function uiUpdate(){
  
  document.getElementById("cumBet").innerText = cumuBet;
  document.getElementById("myBet").innerText = betInfo.reduce((a, b) => a + b, 0);
  document.getElementById("currentChaal").innerText = chaalAmount;
  document.getElementById("currentDouble").innerText = chaalAmount*2;


  get(ref(db,'Round/')).then((snapshot) => {
    var data = snapshot.val();

    var temp = data['RoundData'].names;

    playerList = [];

    for(var i = 1; i < temp.length; i++){
      playerList.push([temp[i],data[temp[i]].totalBet]);
    }

    for(var i = 0; i < playerList.length; i++){
      
      document.getElementById(i+1).children[0].innerText = playerList[i][0][0];
      document.getElementById(i+1).children[1].innerText = playerList[i][1];

      if(data[playerList[i][0]].packed){
        document.getElementById(i+1).children[0].style.opacity = "40%";
        document.getElementById(i+1).children[1].style.opacity = "40%";
      }
    }



  });
  
}

function fbUpdate(amount,ifMove,cumuBet){
  update(ref(db,'Round/' + pName),{
    bets: betInfo,
    totalBet: betInfo.reduce((a, b) => a + b, 0)
  });
  if (ifMove){
    update(ref(db,'Round/RoundData/'),{
      chaal: amount,
      cumBet: cumuBet,
      playingNum: nextPlayer[0]
    });
  }
}

function deactivate(){
  playerActive = false;
  packActive = false;
}

function playChaal(){

  console.log("Chaal");
  betInfo.push(chaalAmount);
  cumuBet += chaalAmount;
  
  console.log(betInfo);
  uiUpdate();
  fbUpdate(chaalAmount,true,cumuBet);
}

function playDouble(){
  console.log("Double");                                                                                                                                                                                                                                                                                                                                                                                          
  chaalAmount *=2;
  betInfo.push(chaalAmount);
  cumuBet += chaalAmount;
  
  console.log(betInfo);
  uiUpdate();
  fbUpdate(chaalAmount,true,cumuBet);
}

function playShow(){
  console.log("Show");
  betInfo.push(chaalAmount);
  cumuBet += chaalAmount;
  
  console.log(betInfo);
  
  uiUpdate();
    
  update(ref(db,'Round/' + pName),{
    bets : betInfo,
    totalBet: betInfo.reduce((a, b) => a + b, 0),
    showing: true
  });
  
  update(ref(db,'Round/' + previousPlayer[1]),{
    showing: true
  });
  
  update(ref(db,'Round/RoundData'),{
    cumBet: cumuBet
  });

}

function playPack(){
  
  get(ref(db,'Round/')).then((snapshot)=>{
    var data = snapshot.val();
    if (data[pName].showing && data[nextPlayer[1]].showing){
      
      var nextID = nextPlayer[0];
      var nameList = data["RoundData"].names;
      var nextnextPlayer = [];
      while (true){
        if ((data[nameList[(nextID == (nameList.length-1)) ? nextID = 1 : ++nextID]].packed) == false){
          nextnextPlayer = [nextID,nameList[nextID]];
          break;
        }
      }
      
      update(ref(db,'Round/' + previousPlayer[1]),{
        showing: false
      });
      
      update(ref(db,'Round/' + nextPlayer[1]),{
        showing: false
      });
      
      update(ref(db,'Round/' + pName),{
        packed: true,
        showing: false
      });
      
      update(ref(db,'Round/RoundData/'),{
        playingNum: nextnextPlayer[0]
      })
      
    } else {
      
      update(ref(db,'Round/' + previousPlayer[1]),{
        showing: false
      });
      
      update(ref(db,'Round/' + nextPlayer[1]),{
        showing: false
      });
      
      update(ref(db,'Round/' + pName),{
        packed: true,
        showing: false
      });
      
      update(ref(db,'Round/RoundData/'),{
        playingNum: nextPlayer[0]
      })
    }

    // checkWin(data);
    
  });
  

  console.log("Pack");
}

function chaalSound() {
  var audio = new Audio("chaal.mp3");
  audio.play();
}


onValue(ref(db,'Round/'),(snapshot) => {
  var dbSnap = snapshot.val();

  if(dbSnap['RoundData'].names == ["Admin"]){
    location.reload();
  }
  
  cumuBet = dbSnap['RoundData'].cumBet;
  // console.log(cumuBet);
  
  chaalAmount = dbSnap["RoundData"].chaal;
  
  uiUpdate();
  
  checkWin(dbSnap);
  
  // console.log(snapshot.val());
  if (pName != undefined && pName != "Admin"){
    if ((dbSnap[pName].playerNum == dbSnap["RoundData"].playingNum) && (dbSnap[pName].packed == false) && (dbSnap[pName].showing == false)){
      activate(dbSnap);
      console.log("You are playing");
      
    } else if (dbSnap[pName].showing){
      
      playerActive = false;
      packActive = true;
      console.log("You are showing");
      
    } else {
      deactivate();
      console.log("Someone Else is playing");
    }
  }
  
  
  if(!playerActive){
    document.getElementById("chaalBut").style.opacity = "40%";
    document.getElementById("doubleBut").style.opacity = "40%";
    document.getElementById("showBut").style.opacity = "40%";
  } else{
    document.getElementById("chaalBut").style.opacity = "100%";
    document.getElementById("doubleBut").style.opacity = "100%";
    document.getElementById("showBut").style.opacity = "100%";
    
  }
  
  if(!packActive){
    document.getElementById("packBut").style.opacity = "40%";
  } else {
    document.getElementById("packBut").style.opacity = "100%";
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

    document.getElementById("doubleBut").style.opacity = "100%";

    chaalSound();
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

document.getElementById("startBut").addEventListener("click", () => {
  startGame();
});

document.getElementById("clearBut").addEventListener("click", () => {
  clearGame();
});

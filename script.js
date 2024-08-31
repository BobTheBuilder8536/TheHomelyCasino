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

import {getDatabase, ref, child, get, set, update, remove} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-database.js";

const db = ref(getDatabase());

get(child(db, `Round/`)).then((snapshot) => {
    if (snapshot.exists()) {
      console.log(snapshot.val());
    } else {
      console.log("No data available");
    }
  });
// function active(){
//     chaalAmount = data[0].chaal;
//     betInfo = data[playerNum].bets;
//     playerActive = true;
// }

// function playChaal(){
//         console.log("Chaal");
//     }

// function playDouble(){Chutiya
//     console.log("Double");
// }

// function playShow(){
//     console.log("Show");
// }

// function playPack(){
//     console.log("Pack");
// }

// function deactive(){
//     //write to json
//     //refresh
//     //
// }
    
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
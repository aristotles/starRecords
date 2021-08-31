
import ReactDOM from 'react-dom'
import React from 'react'
import { render } from "react-dom";
import axios from "axios";

var userList=[]


function goToPage() {
    window.location.href = 'http://localhost:3000/home'
}

//calls for multiple record results
function arrayCalls(type){

    var updateName =""
    var oldName=""
    var searchTerm="name"

    if(type=="ships"){
        updateName="newShips"
        oldName="starships"
    }
    if(type=="vehicles"){
        updateName="newVehicles"
        oldName="vehicles"
    }
    if(type=="films"){
        updateName="newFilms"
        oldName="films"
        searchTerm="title"
    }

    //if empty no call needed
    if (userList[oldName].length == 0) {
        userList[updateName] = "okay"
    }

    else {
        for (let object of userList[oldName]) {
            axios.get(object)
                .then(spResponse => {
                    if (userList[updateName] != "no") {
                        userList[updateName].push(spResponse.data[searchTerm])
                    }
                    else {
                        userList[updateName] = [spResponse.data[searchTerm]]
                    }
                })
        }
    }
}

function getHome(){
    axios.get(userList["homeworld"])
    .then(spResponse => {
        userList["newHome"] = (spResponse.data["name"])
    })
}

function waitForCalls() {

    var finalCard = [];

    if (userList["newVehicles"] != "no" && userList["newFilms"] != "no" && userList["newShips"] != "no") {
  
        finalCard.push(<div className="soleUser"> <p className="category">Born:&nbsp;&nbsp; </p>{userList["birth_year"]}  </div>)
        finalCard.push(<div className="soleUser"> <p className="category">Eye Color:&nbsp;&nbsp; </p>{userList["eye_color"]}  </div>)
        finalCard.push(<div className="soleUser"> <p className="category">Height:&nbsp;&nbsp; </p>{userList["height"]}  </div>)
        finalCard.push(<div className="soleUser"> <p className="category">Mass: &nbsp;&nbsp; </p>{userList["mass"]}  </div>)
        finalCard.push(<div className="soleUser"> <p className="category">Gender: &nbsp;&nbsp; </p>{userList["gender"]}  </div>)
        finalCard.push(<div className="soleUser"> <p className="category">Home: &nbsp;&nbsp;</p>{userList["newHome"]}  </div>)
        finalCard.push(<div className="soleUser"> <p className="category">Skin: &nbsp;&nbsp;</p>{userList["skin_color"]}  </div>)

        if (userList["species"] == 0) {
            userList["species"] = "Human"
            finalCard.push(<div className="soleUser"> <p className="category">Hair Color:&nbsp;&nbsp; </p>{userList["hair_color"]}  </div>)
        }
        else {
            userList["species"] = "Droid"
        }

        finalCard.push(<div className="soleUser"> <p className="category">Species:&nbsp;&nbsp; </p>{userList["species"]}  </div>)

        if (userList["newVehicles"] != "okay") {
            finalCard.push(<div className="soleUser"> <p className="category">Vehicles: &nbsp;&nbsp;</p>{userList["newVehicles"].join()} </div>)
        }

        if (userList["newVFilms"] != "okay") {
            finalCard.push(<div className="soleUser"> <p className="category">Films: &nbsp;&nbsp;</p>{userList["newFilms"].join()} </div>)
        }

        if (userList["newShips"] != "okay") {
            finalCard.push(<div className="soleUser"> <p className="category">Ships: &nbsp;&nbsp;</p>{userList["newShips"].join()} </div>)
        }

        let comboCard =
            <div>
                <div onClick={() => goToPage()} className="backArrow">RETURN</div>
                <h1 className="title soleUser noBorder">{userList["name"]}
                    {finalCard}
                </h1>
            </div>
        ReactDOM.render(comboCard, document.getElementById('root'));
    }

    else {
        setTimeout(waitForCalls, 200);
    }
}

function getUserData() {

    axios.get('https://swapi.dev/api/people/' + '?search=' + window.location.href.split('/')[4])
        .then(response => {

            userList = response.data.results[0]

            userList["newShips"] = "no"
            userList["newFilms"] = "no"
            userList["newVehicles"] = "no"

            getHome()
           
            arrayCalls("vehicles")
            arrayCalls("ships")
            arrayCalls("films")
           
            waitForCalls()
        })
}

export default function User() {
    getUserData()
    return <p>Hello, world!</p>
}
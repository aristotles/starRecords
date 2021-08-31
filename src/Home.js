

import ReactDOM from 'react-dom'
import React from 'react'
import { render } from "react-dom";
import axios from "axios";

let sortedList = []
let starUsers = [];
let totalLength = 0;
let speciesList = []

//searchbar UI component
const SearchBar = ({ keyword, setKeyword }) => {

    return (
        <input
            className="search"
            key="random1"
            value={keyword}
            placeholder={"Search for user"}
            onChange={(e) => searchForUser(e.target.value)}
        />
    );
}

//searchbar main function
function searchForUser(passed) {
  
    for (let user of starUsers) {
        if(user["name"].toLowerCase() == passed.toLowerCase()){
           goToPage(user["name"])
        }
    }
}

//goes to a user page
function goToPage(passedName) {
    window.location.href = 'http://localhost:3000/user/' + passedName;
}

//waits to make sure http calls completed before rendering UI
function waitForCalls() {

    if (starUsers.length == totalLength) {
        createUI()
    }

    else {
        setTimeout(waitForCalls, 200);
    }
}

//sorts users by species
function sortUsers(){
    while (speciesList.length > 0) {
        var currentSpecies = speciesList[speciesList.length - 1]
     
        for (let user of starUsers) {
            if (user["species"] == currentSpecies) {
                sortedList.push(user)
            }
        }

        speciesList.pop(currentSpecies)
    }

}

//combines all UI components together
function createUI() {

    sortUsers()
    
    var allcard = starUsers.map(starUser => {

        var titleClass = "title " + starUser['species']
        var typeClass = "type " + starUser['species']

        return <div onClick={() => goToPage(starUser['name'])} className={titleClass} key={starUser['name']}>{starUser['name']}
            <div className={typeClass} key={starUser['name'] + starUser['species']}>{starUser['species']}
            </div>
        </div>
    })

    var allUI = <h1 className="noBorder bigTitle">
        &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; Star Records
        <SearchBar></SearchBar>
        <br></br>
        {allcard}
    </h1>

    ReactDOM.render(allUI, document.getElementById('root'));
}

//add user function, to keep DRY
function addUser(speciesList, species, user, starUsers) {
    if (speciesList.indexOf(species) == -1) {
        speciesList.push(species)
    }

    user["species"] = species
    starUsers.push(user)
}

//gets users and their species
function getStarUsers() {

    axios.get('https://swapi.dev/api/people/')
        .then(response => {

            var starData = (response.data.results)
            totalLength = starData.length

            for (let user of starData) {

                let species = user["species"]

                if (species.length == 0) {

                    species = "Human"
                    addUser(speciesList, species, user, starUsers)
                }

                else {
                    axios.get(species)
                        .then(spResponse => {
                            species = spResponse.data["name"]
                            addUser(speciesList, species, user, starUsers)
                        })
                }
            }

            waitForCalls()
        }
        )
}

export default function Home() {
    getStarUsers()
    return <p></p>
}
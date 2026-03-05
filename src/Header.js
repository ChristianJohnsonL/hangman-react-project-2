import React from "react";
import './Header.css';
import settings from './Settings.png';


function Header()
{  const handleNewGame = () => {window.location.reload();};
    return(
        <header className = "header">
            <button className="button"
        onClick={handleNewGame} 
        style={{
          marginTop: '20px',
          padding: '10px 20px',
          border: 'none',
          backgroundColor: '#007bff',
          color: 'white',
          fontSize: '16px',
          cursor: 'pointer'
        }}
      >
        New Game
      </button>
            <h1 className="Title">
                Hang 'em
            </h1>
            <img className="settingsPic" src={settings} alt = "settings"/>
        </header>
    );
}

export default Header;
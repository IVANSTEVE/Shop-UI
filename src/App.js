import React from 'react';
import './App.css';


function App() {
    const [contentToDisplay, setContentToDisplay] = React.useState('home');
  return (
    <div>
        <h1>Menu de navigation</h1>
      <nav>
          <ul>
              <li onClick={() => setContentToDisplay('home')}>Home</li>
              <li onClick={() => setContentToDisplay('firstScreen')}>FirstScreen</li>
              <li onClick={() => setContentToDisplay('secondScreen')}>SecondScreen</li>
              <li onClick={() => setContentToDisplay('thirdScreen')}>ThirdScreen</li>
              <li onClick={() => setContentToDisplay('fourthScreen')}>FourthScreen</li>
          </ul>
      </nav>
        <div>
            {contentToDisplay === 'home' && <HomeScreen />}
            {contentToDisplay === 'firstScreen' && <FirstScreen />}
            {contentToDisplay === 'secondScreen' && <SecondScreen />}
            {contentToDisplay === 'thirdScreen' && <ThirdScreen />}
            {contentToDisplay === 'fourthScreen' && <FourthScreen />}
        </div>
    </div>
);
}

function HomeScreen() {
    return <h2>Bienvenue sur la page d'accueil</h2>;
}

function FirstScreen() {
    return <h2>Bienvenue sur la 1ere categorie</h2>;
}

function SecondScreen() {
    return <h2>Bienvenue sur la 2eme categorie</h2>;
}

function ThirdScreen() {
    return <h2>Bienvenue sur la 3eme categorie</h2>;
}

function FourthScreen() {
    return <h2>Bienvenue sur la 4eme categorie</h2>;
}

export default App;

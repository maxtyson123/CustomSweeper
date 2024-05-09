import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {CustomSweeper, Config, Theme} from "../.";

const App = () => {

  const theme : Theme = {
      primaryColor: '#41af85',
      secondaryColor: '#72cca9',
      darkColor: '#2c775b',
      mineImage: 'https://uxwing.com/wp-content/themes/uxwing/download/agriculture-farming-gardening/seed-sprouting-icon.svg',
      flagImage: 'https://www.svgrepo.com/show/470302/water-can.svg'
  }

  const config : Config = {
        title: "Seed Sweeper",
        subtitle: "By Max Tyson",
        goalTitle: "Predict where the seeds are without digging them up!",


        theme: theme
  }

  return (
    <div style={
        {
            width: '100vw',
            height: '100%',
            display: 'grid',
            alignItems: 'center',
            justifyItems: 'center',
            color: 'black',
            fontFamily: 'Arial, sans-serif',
            backgroundColor: '#4DE73D'
        }
    }>
      <CustomSweeper {...config} />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));

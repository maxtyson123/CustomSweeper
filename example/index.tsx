import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {CustomSweeper, Config, Theme} from "../.";

const App = () => {


  const config : Config = {
        title: "Seed Sweeper",
        subtitle: "By Max Tyson",
        goalTitle: "Predict where the seeds are without digging them up!",

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
            backgroundColor: '#4DE73D',

        }
    }>
      <CustomSweeper {...config} />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));

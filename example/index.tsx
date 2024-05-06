import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {CustomSweeper} from "../.";

const App = () => {
  return (
    <div>
      <CustomSweeper />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));

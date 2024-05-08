import * as React from 'react';
import {TopUI} from "./core/ui";
import {Game} from "./core/game";
import "./index.css";

export interface Theme {
    primaryColor?: string;
    secondaryColor?: string;
    darkColor?: string;
    mineImage?: string;
    flagImage?: string;
}

export interface Config {

    theme?: Theme;

    title?: string;
    subtitle?: string;
    goalTitle?: string;
    mineCount?: number;
    rows?: number;
    cols?: number;
}

export const CustomSweeper = (config: Config) => {
  return(
      <>
        {/* Top UI */}
        <TopUI title={config.title} subtitle={config.subtitle} goalTitle={config.goalTitle}/>

        {/* Game */}
        <Game theme={config.theme} mineCount={config.mineCount}/>

        {/* Bottom UI */}
          <br/>
          <br/>
          <br/>

        {/* About */}
      </>
  )
};

import * as React from 'react';
import {SideUI, TopUI} from "./core/ui";
import {Game} from "./core/game";
import "./index.css";
import {Customisation} from "./core/menu";
import {useEffect} from "react";

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
    difficulty?: string;
}

interface FullConfig {
    theme?: Theme;
    title: string;
    subtitle: string;
    goalTitle: string;
    mineCount: number;
    rows: number;
    cols: number;
    difficulty: string;
}

const defaultConfig: FullConfig = {
    title: "Custom Sweeper",
    subtitle: "Fully Customisable Mine Sweeper",
    goalTitle: "Clear the board without detonating any mines!",

    mineCount: 40,
    rows: 16,
    cols: 16,
    difficulty: "Medium",
}
export const CustomSweeper = (config: Config) => {

    // Config State
   const [configState, setConfigState] = React.useState<FullConfig>({
        ...defaultConfig,
        ...config
    })

    useEffect(() => {
        console.log("Config Updated", config);
        setConfigState(prevState => ({...prevState, ...config}));
    }, [config]);

   // Detect mobile
    const [isMobile, setIsMobile] = React.useState<boolean>(false);
    useEffect(() => {
        setIsMobile(window.innerWidth < 600);
    }, []);

    // Menu State
    const [customisationOpen, setCustomisationOpen] = React.useState<boolean>(false);

    // Setters
    const setMineCount = (mineCount: number) => {

        // Set the mine count but ensure it is within the bounds of the grid
        setConfigState(prevState => ({...prevState, mineCount: Math.min(mineCount,
                (prevState.cols ? prevState.cols : 1) *
                (prevState.rows ? prevState.rows : 1) - 1
            )}));
    }

    const setWidth = (width: number) => {
        setConfigState(prevState => ({...prevState, cols: width}));
    }

    const setHeight = (height: number) => {
        setConfigState(prevState => ({...prevState, rows: height}));
    }

    const setDifficulty = (difficulty: string) => {
        console.log("Setting Difficulty", difficulty);
        setConfigState(prevState => ({...prevState, difficulty: difficulty}));
    }


  return(
      <>
          {/* Top UI */}
          {!isMobile && <TopUI title={configState.title} subtitle={configState.subtitle} goalTitle={configState.goalTitle}/>}

          {/* Customisation Controls */}
          <Customisation
              open={customisationOpen}

              setMineCount={setMineCount}
              setWidth={setWidth}
              setHeight={setHeight}
              setDifficulty={setDifficulty}

              mineCount={configState.mineCount}
              width={configState.cols}
              height={configState.rows}
              difficulty={configState.difficulty}
          />

          {/* Game */}
          <Game
              isMobile={isMobile}
              theme={configState.theme}
              mineCount={configState.mineCount}
              rows={configState.rows}
              cols={configState.cols}
          />


          {/* Bottom UI */}
          <br/>
          <br/>

          <button onClick={() => setCustomisationOpen(!customisationOpen)}>Customise</button>

          {/* About */}
      </>
  )
};

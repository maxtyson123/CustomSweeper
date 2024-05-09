import * as React from 'react';
import styles from '../styles/game.module.css';
import {useEffect, useRef} from "react";
import {Flag, Mine} from "./svg";
import {Theme} from "../index";

// TODO : Finidh Game
//      - Add style customisation
//      - Make into classes (eg cells, board)
//      - Add difficulty settings
//      - Time Settings
//      - Add high scores
//      - Add replays
//      - Add AI
//      - Add multiplayer

interface GameProps {
    theme?: Theme;
    mineCount?: number;
}

export function Game(props: GameProps) {

    // Store the game div
    const [gameDiv, setGameDiv] = React.useState<HTMLDivElement | null>(null);
    const [runCount, setRunCount] = React.useState<number>(-1);
    const [overAudio, setOverAudio] = React.useState<HTMLAudioElement | null>(null);

    // Store the time
    const [time, setTime] = React.useState<number>(0);
    const [finalTime, setFinalTime] = React.useState<number>(0);
    const [timeSpan, setTimeSpan] = React.useState<HTMLSpanElement | null>(null);

    // Store the flags
    const [flags, setFlags] = React.useState<number>(0);
    const [flagsSpan, setFlagsSpan] = React.useState<HTMLSpanElement | null>(null);

    // Game State
    const [boardWidth, setBoardWidth] = React.useState<number>(16);
    const [cellWidth, setCellWidth] = React.useState<number>(0);
    const [mineCount, setMineCount] = React.useState<number>(props.mineCount ? props.mineCount : 40);
    const [gameOver, setGameOver] = React.useState<number>(0);
    const [firstClickPos, setFirstClickPos] = React.useState<number[]>([]);
    const [initialSetupDone, setInitialSetupDone] = React.useState<boolean>(false);

    // Game Data
    const [minePlacement, setMinePlacement] = React.useState<boolean[][]>([]);
    const [cellNumbers, setCellNumbers] = React.useState<number[][]>([]);
    const [cellDisplay, setCellDisplay] = React.useState<string[]>([]);

    // Run The game setup when the game div is ready
    const setupStarted = useRef(0);
    useEffect(() => {

        // Check if already setup
        if(setupStarted.current == boardWidth) return;

        // Set up the game
        setupStarted.current = boardWidth;
        setupGame();


    }, [boardWidth]);

    // Set the theme variables
    useEffect(() => {
        // Colors
        document.documentElement.style.setProperty("--primary-color", props?.theme?.primaryColor ? props.theme.primaryColor : "#b2b2b2");
        document.documentElement.style.setProperty("--secondary-color", props?.theme?.secondaryColor ? props.theme.secondaryColor : "#e5e5e5");
        document.documentElement.style.setProperty("--dark-color", props?.theme?.darkColor ? props.theme.darkColor : "#737373");

    }, [props.theme]);

    const setupGame = () => {
        console.log("Setting up game...");

        // Get the elements
        const gameElement = document.getElementById("game") as HTMLDivElement;
        const timeSpan = document.getElementById("time") as HTMLSpanElement;
        const flagsSpan = document.getElementById("flags-left") as HTMLSpanElement;

        // Check if the elements are there
        if(!gameElement || !timeSpan || !flagsSpan) return;

        // Clear the game
        setTime(0);
        setGameOver(0);
        setFlags(mineCount);
        setFirstClickPos([]);

        // Set the elements
        setGameDiv(gameElement);
        setTimeSpan(timeSpan);
        setFlagsSpan(flagsSpan);
        setRunCount(runCount + 1);

        // First setup
        if(!initialSetupDone){

            // Set the audio
            const audio = new Audio("https://raw.githubusercontent.com/harrygritt/13_dgt_python/main/sounds/Top%20Stuff%20Geezer.wav");
            setOverAudio(audio);

            // Start counting time
            setInterval(() => {
                setTime(time => time + 1);
            } , 1000);
        }
    }

    // Wait for the board to be ready before creating it
    useEffect(() => {
        if(!gameDiv && runCount === 0){
            return
        }

        createBoard();

    }, [gameDiv, runCount]);

    const createBoard = () => {


        console.log("Creating board...");
        console.log("Board Width: ", boardWidth);

        // Get the window size and make the board take up 1/4 of the screen
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        const cellWidth = Math.min(windowWidth, windowHeight) / 1.5 /  boardWidth;
        setCellWidth(cellWidth);


        // Resize the board to be square
        gameDiv?.style.setProperty("width", `${cellWidth * boardWidth}px`);
        gameDiv?.style.setProperty("height", `${cellWidth * boardWidth}px`);

        // Reset the board
        gameDiv?.classList.remove(styles.shake);


        // Reset all the cells
        for(let i = 0; i < boardWidth; i++){
            for(let j = 0; j < boardWidth; j++){
                const cell = document.getElementById(`cell-${i}-${j}`);
                if(cell){
                    cell.classList.remove(styles.revealed);
                    cell.classList.remove(styles.preRevealed);
                    cell.classList.remove(styles.flagged);
                    cell.classList.remove(styles.mine);
                    cell.classList.remove(styles.one);
                    cell.classList.remove(styles.two);
                    cell.classList.remove(styles.three);
                    cell.classList.remove(styles.four);
                    cell.classList.remove(styles.five);
                    cell.classList.remove(styles.six);
                    cell.classList.remove(styles.seven);
                    cell.classList.remove(styles.eight);
                }
            }
        }


        // Store which cells have mines
        let mineCells : boolean[][] = Array(boardWidth).fill(false).map(() => Array(boardWidth).fill(false));

        // Place the mines
        for(let i = 0; i < mineCount; i++){

            // Get a random cell
            let x = Math.floor(Math.random() * boardWidth);
            let y = Math.floor(Math.random() * boardWidth);

            // Check if the cell already has a mine
            if(mineCells[x][y]){
                i--;
            }else{
                mineCells[x][y] = true;
            }
        }

        setMinePlacement(mineCells);
    }


    // Setup the numbers for each cell once the mines have been placed
    useEffect(() => {
        if(minePlacement.length > 0){
            setupNumbers();
        }
    }, [minePlacement]);

    const setupNumbers = () => {

        console.log("Setting up numbers...");

        let numbers : number[][] = Array(boardWidth).fill(0).map(() => Array(boardWidth).fill(0));

        // Loop through each cell
        for(let i = 0; i < boardWidth; i++){
            for(let j = 0; j < boardWidth; j++){

                // Get the number of mines around the cell
                const minesAround = getMinesAround(i, j);

                // Set the number
                numbers[i][j] = minesAround;
            }
        }
        console.log("Numbers: ", numbers);
        setCellNumbers(numbers);

        // Set the cell display to empty
        let display : string[] = Array(boardWidth * boardWidth).fill("");
        setCellDisplay(display);

        // All setup is done
        setInitialSetupDone(true);
    }

    const getMinesAround = (x: number, y: number) => {

        // Check if the cell is a mine
        if(minePlacement[x][y]){
            return -1;
        }

        // Check the surrounding cells
        let mines = 0;
        for(let i = -1; i <= 1; i++){
            for(let j = -1; j <= 1; j++){

                // Check if the cell is within the board
                if(x + i >= 0 && x + i < boardWidth && y + j >= 0 && y + j < boardWidth){

                    // Check if the cell is a mine
                    if(minePlacement[x + i][y + j]){
                        mines++;
                    }
                }
            }
        }

        return mines;
    }


    // Actions
    const revealCell = (x: number, y: number) => {

        // Get the display
        let display = [...cellDisplay];

        // Update the display
        display = handleCellReveal(x, y, display, 0);

        // Set the display
        setCellDisplay(display);


    }

    const firstClick = (x: number, y: number) => {
        // Set the first click position
        setFirstClickPos([x, y]);

        // Move the mine
        let mines = [...minePlacement]

        // If the click is in the top left corner
        let start = 0
        if(x < 3 && y < 3){
            start = 3;
        }


        // Clear any mines around/in the first click
        for(let i = -1; i <= 1; i++){
            for(let j = -1; j <= 1; j++){

                // Check if the cell is within the board
                if(x + i >= 0 && x + i < boardWidth && y + j >= 0 && y + j < boardWidth){

                    // Check if the cell is a mine
                    if(minePlacement[x + i][y + j]){
                        mines = moveMine(x + i, y + j, start, mines);
                    }
                }
            }
        }

        // Set the new mine placement
        setMinePlacement(mines);
    }

    const moveMine = (x: number, y: number, start: number, mines: boolean[][]) : boolean[][] => {

        // Try to move the mine
        for(let i = start; i < boardWidth; i++){
            for(let j = start; j < boardWidth; j++){

                // Check if the cell is not a mine
                if(!mines[i][j]){

                    mines[x][y] = false;
                    mines[i][j] = true;

                    return mines;
                }
            }
        }

        return mines;
    }

    // Once the numbers have updated, reveal the cell
    useEffect(() => {
        if(firstClickPos.length > 0){
            revealCell(firstClickPos[0], firstClickPos[1]);
        }
    }, [cellNumbers]);


    const tryQuickReveal = (x: number, y: number, display: string[]) : string[] => {

        // Get the cell contents
        const cell = cellDisplay[x * boardWidth + y];

        // Check if the cell is empty
        if(cell === "") return display;

        // Get the number of flags around the cell
        let flags = 0;
        for(let i = -1; i <= 1; i++){
            for(let j = -1; j <= 1; j++){

                // Check if the cell is within the board
                if(x + i >= 0 && x + i < boardWidth && y + j >= 0 && y + j < boardWidth){

                    // Check if the cell is flagged
                    if(cellDisplay[(x + i) * boardWidth + y + j] === "F"){
                        flags++;
                    }
                }
            }
        }

        // Check if the flags match the number
        if(flags !== parseInt(cell)) return display;

        // Reveal the surrounding cells
        for(let i = -1; i <= 1; i++){
            for(let j = -1; j <= 1; j++){

                // Check if the cell is within the board
                if(x + i >= 0 && x + i < boardWidth && y + j >= 0 && y + j < boardWidth){

                    // Check if the cell is not flagged
                    if(cellDisplay[(x + i) * boardWidth + y + j] !== "F"){
                        display = handleCellReveal(x + i, y + j, display);
                    }
                }
            }
        }

        return display;
    }

    const handleCellReveal = (x: number, y: number, display: string[], iter = 1) : string[] => {

        // Handle the first click
        if(firstClickPos.length === 0){
            firstClick(x, y);
            return display;
        }

        // Ignore if the game is over
        if(gameOver != 0) return display;

        // Get the cell
        const cell = document.getElementById(`cell-${x}-${y}`);

        // Check if the cell is already revealed
        if(cell?.classList.contains(styles.revealed) || cell?.classList.contains(styles.preRevealed)){
            if(iter != 0) return display;
            return tryQuickReveal(x, y, display);
        }

        // Check if the cell is flagged
        if(cell?.classList.contains(styles.flagged)) return display;

        // Check if the cell is a mine
        if(minePlacement[x][y]){
            return endGame(x, y, display);
        }

        // Reveal the cell
        cell?.classList.add(styles.preRevealed);
        setTimeout(() => {
           cell?.classList.add(styles.revealed);
           cell?.classList.remove(styles.preRevealed);
        }, 10 * iter);

        // Check if the cell is a number
        if(cellNumbers[x][y] > 0){

            // Set the display
            display[x * boardWidth + y] = cellNumbers[x][y].toString();

            // Set the number class
            cell?.classList.add(styles.number);
            switch (cellNumbers[x][y]) {
                case 1:
                    cell?.classList.add(styles.one);
                    break;

                case 2:
                    cell?.classList.add(styles.two);
                    break;

                case 3:
                    cell?.classList.add(styles.three);
                    break;

                case 4:
                    cell?.classList.add(styles.four);
                    break;

                case 5:
                    cell?.classList.add(styles.five);
                    break;

                case 6:
                    cell?.classList.add(styles.six);
                    break;

                case 7:
                    cell?.classList.add(styles.seven);
                    break;

                case 8:
                    cell?.classList.add(styles.eight);
                    break;

                default:
                    break;

            }
        }

        // Check if the cell is empty
        if(cellNumbers[x][y] === 0){

            for(let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {

                    // Check if the cell is within the board
                    if (x + i >= 0 && x + i < boardWidth && y + j >= 0 && y + j < boardWidth) {

                        // Reveal the cell
                        display = handleCellReveal(x + i, y + j, display, iter + 1);
                    }
                }
            }
        }

        // Return the display
        return display;
    }

    const flagCell = (x: number, y: number) => {

        // Ignore if the game is over
        if(gameOver != 0) return;

        // Get the cell
        const cell = document.getElementById(`cell-${x}-${y}`);

        // Check if the cell is already revealed
        if(cell?.classList.contains(styles.revealed)) return;

        // Get the flag
        const isFlagged = cell?.classList.contains(styles.flagged);

        // Display the flag
        let display = [...cellDisplay];
        display[x * boardWidth + y] = isFlagged ? "" : "F";
        setCellDisplay(display);

        // Check if the cell is already flagged
        if(isFlagged){
            cell?.classList.remove(styles.flagged);
            setFlags(flags + 1);
            return;
        }

        // Flag the cell
        cell?.classList.add(styles.flagged);
        setFlags(flags - 1);


        // Check if the player has won
        checkWin();

    }

    // Game States
    const checkWin = () => {

        // Check if the player has won
        let win = true;
        for(let x = 0; x < boardWidth; x++){
            for(let y = 0; y < boardWidth; y++){

                // Get the cell
                const cell = document.getElementById(`cell-${x}-${y}`);

                // Check if the cell is a mine
                if(minePlacement[x][y]){

                    // If the cell is not flagged
                    if(!cell?.classList.contains(styles.flagged)){
                        return;
                    }
                }
            }
        }

        // Check if the player has won
        if(win){

            // Win
            console.log("You Win!");
            overAudio?.play();

            // Reveal all cells
            for(let i = 0; i < boardWidth; i++){
                for(let j = 0; j < boardWidth; j++){

                    // Get the cell
                    const cell = document.getElementById(`cell-${i}-${j}`);

                    // Check if the cell is a mine
                    if(!minePlacement[i][j]){
                        revealCell(i, j);
                    }
                }
            }

            // Set the game over flag
            setGameOver(2);
            gameCleanup();
        }
    }

    const endGame = (x: number, y: number, display: string[]) : string[] => {

        console.log("Game Over!");
        console.log("Mine at: ", x, y);

        // Reveal all cells
        for(let i = 0; i < boardWidth; i++){
            for(let j = 0; j < boardWidth; j++){

                // Get the cell
                const cell = document.getElementById(`cell-${i}-${j}`);

                // Check if the cell is a mine
                if(minePlacement[i][j]){
                    // Add the mine class
                    cell?.classList.add(styles.mine);
                    cell?.classList.add(styles.revealed);

                    // Set the mine data
                    display[i * boardWidth + j] = "M";
                }
            }
        }

        // Shake the board
        gameDiv?.classList.add(styles.shake);

        // Set the game over flag
        setGameOver(1);
        gameCleanup();
        return display;
    }

    const gameCleanup = () => {

        // Set the final time
        setFinalTime(time);
    }

    // Update the flags left
    useEffect(() => {
        if(flagsSpan){
            flagsSpan.innerText = flags.toString();
        }
    }, [flags, flagsSpan]);

    // Update the time
    useEffect(() => {
        if(timeSpan){
            timeSpan.innerText = time.toString();
        }
    }, [time, timeSpan]);


    return (
        <>


            {/* Top UI */}
            <div className={styles.topBarContainer}>

                {/* Border */}
                <div className={styles.borderCornerTopLeft}/>
                <div className={styles.borderTop} style={{width: cellWidth * boardWidth / 2}}/>
                <div className={styles.borderCornerTopRight}/>

                <div className={styles.borderRight} style={{height: cellWidth * boardWidth / 8, }}/>

                <div className={styles.topBar} style={{width: cellWidth * boardWidth / 2, height: cellWidth * boardWidth / 8}}>
                    <div className={styles.topBarLeft}>
                        <h1> Flags Left: </h1>
                        <span id={"flags-left"}></span>
                    </div>
                    <div className={styles.topBarRight}>
                        <h1> Time: </h1>
                        <span id={"time"}></span>
                    </div>
                </div>

                <div className={styles.borderLeft} style={{height: cellWidth * boardWidth / 8}}/>
            </div>

            <div className={styles.gameContainer}>

                {/* Border */}
                <div className={styles.borderCornerTopLeft}/>
                <div className={styles.borderTop} style={{width: cellWidth * boardWidth}}/>
                <div className={styles.borderCornerTopRight}/>

                <div className={styles.borderRight} style={{height: cellWidth * boardWidth}}/>

                {/* Game */}
                <div className={styles.mainGame} id={"game"}>

                    {/* Map the cells */}
                    {cellDisplay.map((cell, index) => {
                        return (
                            <div
                                key={index}
                                id={`cell-${Math.floor(index / boardWidth)}-${index % boardWidth}`}
                                style={
                                    {
                                        width: cellWidth,
                                        height: cellWidth,
                                        fontSize: `${cellWidth / 1.5}px`,
                                    }
                                }
                                className={styles.cell}
                                onClick={() => revealCell(Math.floor(index / boardWidth), index % boardWidth)}
                                onContextMenu={(e) => {
                                    e.preventDefault();
                                    flagCell(Math.floor(index / boardWidth), index % boardWidth);
                                }}
                            >

                                {cell === "M" ? props.theme?.mineImage ? <img src={props.theme.mineImage} width={cellWidth / 1.5} height={cellWidth / 1.5}/> : <Mine width={cellWidth / 1.5} height={cellWidth / 1.5}/>
                                : cell === "F" ? props.theme?.flagImage ? <img src={props.theme.flagImage} width={cellWidth / 1.5} height={cellWidth / 1.5}/> : <Flag width={cellWidth / 1.5} height={cellWidth / 1.5}/>
                                : cell}

                            </div>
                        )
                    })}

                    {/* Game Over Display */}
                    {gameOver !== 0 &&
                        <div className={styles.gameOver + " " + (gameOver === 1 ? styles.loose : styles.win)}>
                            <h1> {gameOver === 1 ? "Game Over" : "You Win!"} </h1>
                            <p>Total Time: {finalTime} seconds</p>
                            <button onClick={setupGame}> Replay</button>
                        </div>
                    }

                </div>


                {/* Border */}
                <div className={styles.borderLeft} style={{height: cellWidth * boardWidth}}/>
                <div className={styles.borderCornerBottomLeft}/>
                <div className={styles.borderBottom} style={{width: cellWidth * boardWidth}}/>
                <div className={styles.borderCornerBottomRight}/>
            </div>

        </>
    );
}
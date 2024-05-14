import * as React from 'react';
import styles from '../styles/game.module.css';
import {useEffect, useRef} from "react";
import {Flag, Mine} from "./svg";
import {Theme} from "../index";
import {Container, Zoom} from "./ui";

// TODO : Finidh Game
//      - Add style customisation
//      - Make into classes (eg cells, board)
//      - Add difficulty settings
//      - Time Settings
//      - Add high scores
//      - Add replays
//      - Add AI
//      - Add multiplayer

//NOTE: For debuging puroposes the arrays will be y, x instead of x, y (the cell id is cell-x-y)

interface GameProps {
    theme?: Theme;
    isMobile?: boolean;
    mineCount: number;
    rows: number;
    cols: number;
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
    const pressTimeout = useRef<NodeJS.Timeout | null>(null);

    // Store the flags
    const [flags, setFlags] = React.useState<number>(0);
    const [flagsSpan, setFlagsSpan] = React.useState<HTMLSpanElement | null>(null);

    // Game State
    const [boardWidth, setBoardWidth] = React.useState<number>(0);
    const [boardHeight, setBoardHeight] = React.useState<number>(0);
    const [cellWidth, setCellWidth] = React.useState<number>(0);
    const [mineCount, setMineCount] = React.useState<number>(0);
    const [gameOver, setGameOver] = React.useState<number>(0);
    const [firstClickPos, setFirstClickPos] = React.useState<number[]>([]);
    const [initialSetupDone, setInitialSetupDone] = React.useState<boolean>(false);

    // Game Data
    const [minePlacement, setMinePlacement] = React.useState<boolean[][]>([]);
    const [cellNumbers, setCellNumbers] = React.useState<number[][]>([]);
    const [cellDisplay, setCellDisplay] = React.useState<string[][]>([]);

    // Run The game setup when the game div is ready
    useEffect(() => {

        // Prelim checks
        if(mineCount === 0) return;
        if(boardWidth === 0) return;
        if(boardHeight === 0) return;

        setupGame();
    }, [mineCount, boardWidth, boardHeight]);

    // Log the props
    useEffect(() => {
        // console.log("Game Props: ", props);
        setMineCount(props.mineCount)
        setBoardWidth(props.cols)
        setBoardHeight(props.rows)
    }, [props]);

    // Set the theme variables
    useEffect(() => {
        // Colors
        document.documentElement.style.setProperty("--primary-color", props?.theme?.primaryColor ? props.theme.primaryColor : "#b2b2b2");
        document.documentElement.style.setProperty("--secondary-color", props?.theme?.secondaryColor ? props.theme.secondaryColor : "#e5e5e5");
        document.documentElement.style.setProperty("--dark-color", props?.theme?.darkColor ? props.theme.darkColor : "#737373");

    }, [props.theme]);

    const setupGame = () => {

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
        clearTimeout(pressTimeout.current as NodeJS.Timeout);

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

        // Get the window size and make the board take up 1/4 of the screen
        const cellWidth = 40;
        setCellWidth(cellWidth);


        // Resize the board to be square
        gameDiv?.style.setProperty("width", `${cellWidth * boardWidth}px`);
        gameDiv?.style.setProperty("height", `${cellWidth * boardHeight}px`);

        // Reset the board
        gameDiv?.classList.remove(styles.shake);


        // Reset all the cells
        for(let i = 0; i < boardWidth; i++){
            for(let j = 0; j < boardHeight; j++){
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
        let mineCells : boolean[][] = Array(boardHeight).fill(false).map(() => Array(boardWidth).fill(false));

        // Place the mines
        for(let i = 0; i < mineCount; i++){

            // Get a random cell
            let x = Math.floor(Math.random() * boardWidth);
            let y = Math.floor(Math.random() * boardHeight);

            // Check if the cell already has a mine
            if(mineCells[y][x]){
                i--;
            }else{
                mineCells[y][x] = true;
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

        let numbers : number[][] = Array(boardHeight).fill(0).map(() => Array(boardWidth).fill(0));

        // Loop through each cell
        for(let i = 0; i < boardWidth; i++){
            for(let j = 0; j < boardHeight; j++){

                // Get the number of mines around the cell
                const minesAround = getMinesAround(i, j);

                // Set the number
                numbers[j][i] = minesAround;
            }
        }
        setCellNumbers(numbers);

        // Set the cell display to empty
        let display : string[][] = Array(boardHeight).fill("").map(() => Array(boardWidth).fill(""));
        setCellDisplay(display);

        // All setup is done
        setInitialSetupDone(true);
    }

    const getMinesAround = (x: number, y: number) => {

        // Check if the cell is a mine
        if(minePlacement[y][x]){
            return -1;
        }

        // Check the surrounding cells
        let mines = 0;
        for(let i = -1; i <= 1; i++){
            for(let j = -1; j <= 1; j++){

                // Check if the cell is within the board
                if(x + i >= 0 && x + i < boardWidth && y + j >= 0 && y + j < boardHeight){

                    // Check if the cell is a mine
                    if(minePlacement[y + j][x + i]){
                        mines++;
                    }
                }
            }
        }

        return mines;
    }


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
                if(x + i >= 0 && x + i < boardWidth && y + j >= 0 && y + j < boardHeight){

                    // Check if the cell is a mine
                    if(minePlacement[y + j][x + i]){
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
            for(let j = start; j < boardHeight; j++){

                // Check if the cell is not a mine
                if(!mines[j][i]){

                    mines[y][x] = false;
                    mines[j][i] = true;

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


    const tryQuickReveal = (x: number, y: number, display: string[][]) : string[][] => {

        // Get the cell contents
        const cell = cellDisplay[y][x];

        // Check if the cell is empty
        if(cell === "") return display;

        // Get the number of flags around the cell
        let flags = 0;
        for(let i = -1; i <= 1; i++){
            for(let j = -1; j <= 1; j++){

                // Check if the cell is within the board
                if(x + i >= 0 && x + i < boardWidth && y + j >= 0 && y + j < boardHeight){

                    // Check if the cell is flagged
                    if(cellDisplay[y + j][x + i] === "F"){
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
                if(x + i >= 0 && x + i < boardWidth && y + j >= 0 && y + j < boardHeight){

                    // Check if the cell is not flagged
                    if(cellDisplay[y + j][x + i] !== "F"){
                        display = handleCellReveal(x + i, y + j, display);
                    }
                }
            }
        }

        return display;
    }

    const handleCellReveal = (x: number, y: number, display: string[][], iter = 1) : string[][] => {

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
        if(minePlacement[y][x]){
            return endGame(x, y, display);
        }

        // Reveal the cell
        cell?.classList.add(styles.preRevealed);
        setTimeout(() => {
           cell?.classList.add(styles.revealed);
           cell?.classList.remove(styles.preRevealed);
        }, 10 * iter);

        // Check if the cell is a number
        if(cellNumbers[y][x] > 0){

            // Set the display
            display[y][x] = cellNumbers[y][x].toString();

            // Set the number class
            cell?.classList.add(styles.number);
            switch (cellNumbers[y][x]) {
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
        if(cellNumbers[y][x] === 0){

            for(let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {

                    // Check if the cell is within the board
                    if (x + i >= 0 && x + i < boardWidth && y + j >= 0 && y + j < boardHeight) {

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
        display[y][x] = isFlagged ? "" : "F";
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
            for(let y = 0; y < boardHeight; y++){

                // Get the cell
                const cell = document.getElementById(`cell-${x}-${y}`);

                // Check if the cell is a mine
                if(minePlacement[y][x]){

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
                for(let j = 0; j < boardHeight; j++){

                    // Get the cell
                    const cell = document.getElementById(`cell-${i}-${j}`);

                    // Check if the cell is a mine
                    if(!minePlacement[j][i]){
                        revealCell(i, j);
                    }
                }
            }

            // Set the game over flag
            setGameOver(2);
            gameCleanup();
        }
    }

    const endGame = (x: number, y: number, display: string[][]) : string[][] => {

        console.log("Game Over!");
        console.log("Mine at: ", x, y);

        // Reveal all cells
        for(let i = 0; i < boardWidth; i++){
            for(let j = 0; j < boardHeight; j++){

                // Get the cell
                const cell = document.getElementById(`cell-${i}-${j}`);

                // Check if the cell is a mine
                if(minePlacement[j][i]){
                    // Add the mine class
                    cell?.classList.add(styles.mine);
                    cell?.classList.add(styles.revealed);

                    // Set the mine data
                    display[j][i] = "M";
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

        // Clear the time
        clearTimeout(pressTimeout.current as NodeJS.Timeout);
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


    // When the timeout is change set an auto clear
    useEffect(() => {
        setTimeout(() => {
            clearTimeout(pressTimeout.current as NodeJS.Timeout);
        }, 175);
    }, [pressTimeout]);

    return (
        <>


            {/* Top UI */}
            <Container top={true} left={true} right={true} style={ props.isMobile ? {
              justifySelf: "start",
            } : {}}>
                <div className={styles.topBar} style={{
                    width: props.isMobile ? "calc(100vw - 50px)" : cellWidth * boardWidth / 2,
                    height: props.isMobile ? "90px" : cellWidth * boardHeight / 8
                }}>
                    <div className={styles.topBarLeft}>
                        <h1> Flags Left: </h1>
                        <span id={"flags-left"}></span>
                    </div>
                    <div className={styles.topBarRight}>
                        <h1> Time: </h1>
                        <span id={"time"}></span>
                    </div>
                </div>
            </Container>

            <Container top={true} left={true} right={true} bottom={true} style={props.isMobile ? {
                width: "100vw",
                height: "calc(100vh - 90px - 25px)",
                overflow: "hidden",
                justifySelf: "start",
            } : {}}
            >
                <Zoom boundHeight={767} boundWidth={380}>
                    <div className={styles.mainGame} id={"game"}>

                    {/* Map the cells */}
                    {cellDisplay.map((col, y_index) => col.map((cell, x_index) => {
                        return (
                            <div

                                // ID
                                key={x_index * boardWidth + y_index}
                                id={`cell-${x_index}-${y_index}`}

                                // Styling
                                style={
                                    {
                                        width: cellWidth,
                                        height: cellWidth,
                                        fontSize: `${cellWidth / 1.5}px`,
                                    }
                                }
                                className={styles.cell}

                                // PC Controls
                                onClick={() => {
                                    if(props.isMobile) return;

                                    revealCell(x_index, y_index);
                                }}
                                onContextMenu={(e) => {
                                    if(props.isMobile) return;

                                    e.preventDefault();
                                    flagCell(x_index, y_index);
                                }}

                                // Touch Controls
                                onTouchStart={() => {
                                    pressTimeout.current = setTimeout(() => {
                                        flagCell(x_index, y_index);
                                    }, 150);
                                }}
                                onTouchEnd={() => {
                                    clearTimeout(pressTimeout.current as NodeJS.Timeout);
                                    revealCell(x_index, y_index);
                                }}
                            >

                                {cell === "M" ? props.theme?.mineImage ? <img src={props.theme.mineImage} width={cellWidth / 1.5} height={cellWidth / 1.5}/> : <Mine width={cellWidth / 1.5} height={cellWidth / 1.5}/>
                                : cell === "F" ? props.theme?.flagImage ? <img src={props.theme.flagImage} width={cellWidth / 1.5} height={cellWidth / 1.5}/> : <Flag width={cellWidth / 1.5} height={cellWidth / 1.5}/>
                                : cell}

                            </div>
                        )
                    }))}

                    {/* Game Over Display */}
                    {gameOver !== 0 &&
                        <div className={styles.gameOver + " " + (gameOver === 1 ? styles.loose : styles.win)}>
                            <h1> {gameOver === 1 ? "Game Over" : "You Win!"} </h1>
                            <p>Total Time: {finalTime} seconds</p>
                            <button onClick={setupGame}> Replay</button>
                        </div>
                    }

                </div>
                </Zoom>
            </Container>

        </>
    );
}
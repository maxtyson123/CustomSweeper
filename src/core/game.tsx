import * as React from 'react';
import styles from '../styles/game.module.css';
import {useEffect, useRef} from "react";

// TODO : Bugs
//      - Numbers wrong
//      - Mine display wrong


// TODO : Finidh Game
//      - Make First Click Safe
//      - Style the game
//      - Make into classes (eg cells, board)
//      - Add game over screen
//      - Add win screen
//      - Add style customisation
//      - Add difficulty settings
//      - Add high scores
//      - Add audio
//      - Add animations
//      - Add replay button
//      - Add AI
//      - Add multiplayer


export function Game(){

    // Store the game div
    const [gameDiv, setGameDiv] = React.useState<HTMLDivElement | null>(null);

    // Store the time
    const [time, setTime] = React.useState<number>(0);
    const [timeSpan, setTimeSpan] = React.useState<HTMLSpanElement | null>(null);

    // Store the flags
    const [flags, setFlags] = React.useState<number>(0);
    const [flagsSpan, setFlagsSpan] = React.useState<HTMLSpanElement | null>(null);

    // Game State
    const [boardWidth, setBoardWidth] = React.useState<number>(10);
    const [mineCount, setMineCount] = React.useState<number>(20);
    const [minePlacement, setMinePlacement] = React.useState<boolean[]>([]);
    const [cellNumbers, setCellNumbers] = React.useState<number[]>([]);
    const [cellDisplay, setCellDisplay] = React.useState<string[]>([]);
    const [gameOver, setGameOver] = React.useState<boolean>(false);

    // Run The game setup when the game div is ready
    const setupStarted = useRef(false);
    useEffect(() => {

        // Check if already setup
        if(setupStarted.current) return;

        // Set up the game
        setupStarted.current = true;
        setupGame();


    }, []);

    const setupGame = () => {

        console.log("Setting up game...");

        // Get the elements
        const gameDiv = document.getElementById("game") as HTMLDivElement;
        const timeSpan = document.getElementById("time") as HTMLSpanElement;
        const flagsSpan = document.getElementById("flags-left") as HTMLSpanElement;

        // Check if the elements are there
        if(!gameDiv || !timeSpan || !flagsSpan) return;

        // Set the elements
        setGameDiv(gameDiv);
        setTimeSpan(timeSpan);
        setFlagsSpan(flagsSpan);

        // Set the flags
        setFlags(mineCount);

        // Start counting time
        setInterval(() => {
            setTime(time => time + 1);
        }, 1000);
    }

    // Wait for the board to be ready before creating it
    useEffect(() => {
        if(gameDiv){
            createBoard();
        }
    }, [gameDiv]);

    const createBoard = () => {


        console.log("Creating board...");
        console.log("Board Width: ", boardWidth);
        console.log("Game Div: ", gameDiv);

        // Store which cells have mines
        let mineCells : boolean[] =  Array(mineCount).fill(true).concat(Array(boardWidth * boardWidth - mineCount).fill(false));
        mineCells = mineCells.sort(() => Math.random() - 0.5);
        setMinePlacement(mineCells);
    }

    // Setup the numbers for each cell once the mines have been placed
    useEffect(() => {
        console.log("Mine Placement: ", minePlacement);
        if(minePlacement.length > 0){
            console.log("Mines placed...");
            setupNumbers();
        }
    }, [minePlacement]);

    const setupNumbers = () => {

        console.log("Setting up numbers...");

        let numbers : number[] = [];

        // Loop through each cell
        for(let i = 0; i < boardWidth; i++){
            for(let j = 0; j < boardWidth; j++){

                // Get the number of mines around the cell
                const minesAround = getMinesAround(i, j);

                // Set the number
                numbers.push(minesAround);
            }
        }
        console.log("Numbers: ", numbers);
        setCellNumbers(numbers);

        // Set the cell display to empty
        let display : string[] = Array(boardWidth * boardWidth).fill("");
        setCellDisplay(display);
    }

    const getMinesAround = (x: number, y: number) => {

        // Check if the cell is a mine
        if(minePlacement[x * boardWidth + y]){
            return -1;
        }

        // Check the surrounding cells
        let mines = 0;
        for(let i = -1; i <= 1; i++){
            for(let j = -1; j <= 1; j++){

                // Check if the cell is within the board
                if(x + i >= 0 && x + i < boardWidth && y + j >= 0 && y + j < boardWidth){

                    // Check if the cell is a mine
                    if(minePlacement[(x + i) * boardWidth + (y + j)]){
                        mines++;
                    }
                }
            }
        }
        return mines;
    }


    // Actions
    const revealCell = (x: number, y: number) => {

        // Ignore if the game is over
        if(gameOver) return;

        // Get the cell
        const cell = document.getElementById(`cell-${x}-${y}`);

        // Check if the cell is already revealed
        if(cell?.classList.contains(styles.revealed)) return;

        // Check if the cell is flagged
        if(cell?.classList.contains(styles.flagged)) return;

        // Check if the cell is a mine
        if(minePlacement[x * boardWidth + y]){
            endGame(x, y);
            return;
        }

        // Reveal the cell
        cell?.classList.add(styles.revealed);

        // Check if the cell is a number
        if(cellNumbers[x * boardWidth + y] > 0){

            // Set the number
            let display = [...cellDisplay];
            display[x * boardWidth + y] = cellNumbers[x * boardWidth + y].toString();
            setCellDisplay(display);

            // Set the number class
            switch (cellNumbers[x * boardWidth + y]) {
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
        if(cellNumbers[x * boardWidth + y] === 0){

            // Check the surrounding cells
            for(let i = -1; i <= 1; i++){
                for(let j = -1; j <= 1; j++){

                    // Check if the cell is within the board
                    if(x + i >= 0 && x + i < boardWidth && y + j >= 0 && y + j < boardWidth){

                        // Reveal the cell
                        revealCell(x + i, y + j);
                    }
                }
            }
        }
    }

    const flagCell = (x: number, y: number) => {

        // Ignore if the game is over
        if(gameOver) return;

        // Get the cell
        const cell = document.getElementById(`cell-${x}-${y}`);

        // Check if the cell is already revealed
        if(cell?.classList.contains(styles.revealed)) return;

        // Check if the cell is already flagged
        if(cell?.classList.contains(styles.flagged)){
            cell.classList.remove(styles.flagged);
            setFlags(flags + 1);
            return;
        }

        // Flag the cell
        cell?.classList.add(styles.flagged);
        setFlags(flags - 1);

        // Display the flag
        let display = [...cellDisplay];
        display[x * boardWidth + y] = "F";
        setCellDisplay(display);

        // Check if the player has won
        checkWin();

    }

    // Game States
    const checkWin = () => {

        // Check if the player has won
        let win = true;
        for(let i = 0; i < boardWidth; i++){
            for(let j = 0; j < boardWidth; j++){

                // Get the cell
                const cell = document.getElementById(`cell-${i}-${j}`);

                // Check if the cell is a mine
                if(minePlacement[i * boardWidth + j]){
                    if(!cell?.classList.contains(styles.flagged)){
                        win = false;
                    }
                }
            }
        }

        // Check if the player has won
        if(win){
            console.log("You Win!");
            setGameOver(true);
        }
    }

    const endGame = (x: number, y: number) => {

        console.log("Game Over...");
        console.log("Mine at: ", x, y);

        // Reveal all cells
        for(let i = 0; i < boardWidth; i++){
            for(let j = 0; j < boardWidth; j++){

                // Get the cell
                const cell = document.getElementById(`cell-${i}-${j}`);

                // Check if the cell is a mine
                if(minePlacement[i * boardWidth + j]){
                    // Add the mine class and inner text
                    cell?.classList.add(styles.mine);

                    // Set the mine data
                    let display = [...cellDisplay];
                    display[i * boardWidth + j] = "M";
                    setCellDisplay(display);
                }
            }
        }

        // Set the game over flag
        setGameOver(true);
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


    // Log the cell display
    useEffect(() => {
        console.log("Cell Display: ", cellDisplay);
    }, [cellDisplay]);

    return (
        <>
            {/* Game */}
            <div className={styles.mainGame} id={"game"}>

                {/* Map the cells */}
                {cellDisplay.map((cell, index) => {
                    return (
                        <div
                            key={index}
                            id={`cell-${Math.floor(index / boardWidth)}-${index % boardWidth}`}
                            className={styles.cell}
                            onClick={() => revealCell(Math.floor(index / boardWidth), index % boardWidth)}
                            onContextMenu={(e) => {
                                e.preventDefault();
                                flagCell(Math.floor(index / boardWidth), index % boardWidth);
                            }}
                         >
                            {cell}
                        </div>
                    )
                })}
            </div>
        </>
    );
}
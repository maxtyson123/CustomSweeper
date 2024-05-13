import {SideUI, SliderInput, SliderInputNumber} from "./ui";
import React from 'react';

interface CustomisationProps {
    open: boolean;

    // Setters
    setDifficulty: (difficulty: string) => void;
    setMineCount: (mineCount: number) => void;
    setWidth: (width: number) => void;
    setHeight: (height: number) => void;

    // Values
    difficulty: string;
    mineCount: number;
    width: number;
    height: number;


}

export function Customisation(props: CustomisationProps) {

    const setDifficulty = (difficulty: string) => {

        props?.setDifficulty(difficulty)

        switch(difficulty) {
            case "Easy":
                props.setMineCount(10);
                props.setWidth(9);
                props.setHeight(9);
                break;
            case "Medium":
                props.setMineCount(40);
                props.setWidth(16);
                props.setHeight(16);
                break;
            case "Hard":
                props.setMineCount(99);
                props.setWidth(30);
                props.setHeight(16);
                break;

            case "Extreme":
                props.setMineCount(160);
                props.setWidth(30);
                props.setHeight(24);
                break;

            case "Challenge":
                props.setMineCount(270);
                props.setWidth(30);
                props.setHeight(30);
                break;
        }
    }

    return(
        <SideUI open={props.open} side={"left"}>
            <SliderInput
                title={"Difficulty"}
                options={["Easy", "Medium", "Hard", "Extreme", "Challenge", "Custom"]}
                value={props.difficulty}
                onChange={setDifficulty}
            />
            <SliderInputNumber
                title={"Width"}
                value={props.width}
                min={3}
                max={30}
                onChange={(value) => {props.setWidth(value); setDifficulty("Custom")}}
            />
            <SliderInputNumber
                title={"Height"}
                value={props.height}
                min={3}
                max={30}
                onChange={(value) => {props.setHeight(value); setDifficulty("Custom")}}
            />
            <SliderInputNumber
                title={"Mines"}
                value={props.mineCount}
                min={1}
                max={999}
                onChange={(value) => {props.setMineCount(value); setDifficulty("Custom")}}
            />
        </SideUI>
    )
}
import * as React from 'react';
import styles from '../styles/ui.module.css';
import {useEffect} from "react";


interface TopUIProps {
    title?: string;
    subtitle?: string;
    goalTitle?: string;
}
export function TopUI(props: TopUIProps) {
    return (
        <>

            {/* Title UI */}
            <div className={styles.titleBar}>
                <h1> {props.title ? props.title : "Custom Sweeper"} </h1>
                <div>
                    <h2> {props.subtitle ? props.subtitle : "Fully Customisable Mine Sweeper"} </h2>
                    <p> {props.goalTitle ? props.goalTitle : "Clear the board without detonating any mines!"} </p>
                    <p>See also: <a href={"https://maxtyson123.github.io/2048"}><strong>2048 WildCard</strong></a></p>
                </div>
            </div>

        </>
    );
}

interface ContainerProps {
    children: React.ReactNode;
    left?: boolean;
    right?: boolean;
    top?: boolean;
    bottom?: boolean;
}

export function Container(props: ContainerProps) {

    return(
        <>
            <div style={{
                display: 'grid',
                gridTemplateColumns: (props.left ? "25px " : "") + "1fr " + (props.right ? "25px" : ""),
                gridTemplateRows: (props.top ? "25px " : "") + "1fr " + (props.bottom ? "25px" : ""),
            }}>
                {/* Top */}
                {props.top && props.left && <div className={styles.borderCornerTopLeft}/>}
                {props.top && <div className={styles.borderTop}/>}
                {props.top && props.right && <div className={styles.borderCornerTopRight}/>}

                {/* Middle */}
                {props.left && <div className={styles.borderLeft}/>}
                <div style={{ width: '100%', height: '100%'}}>
                    {props.children}
                </div>

                {props.right && <div className={styles.borderRight}/>}

                {/* Bottom */}
                {props.bottom && props.left && <div className={styles.borderCornerBottomLeft}/>}
                {props.bottom && <div className={styles.borderBottom}/>}
                {props.bottom && props.right && <div className={styles.borderCornerBottomRight}/>}
            </div>
        </>
    )

}

interface SideUIProps {
    children: React.ReactNode;
    title?: string;
    subtitle?: string;
    open?: boolean;
    side?: "left" | "right";
}

export function SideUI(props: SideUIProps) {

    const [open, setOpen] = React.useState(props.open ? props.open : false)
    useEffect(() => {
        setOpen(props.open ? props.open : false);
    }, [props.open])


    return(
        <div className={styles.sidenav + " " + (open ? styles.open : "")} style={{
            left: props.side === "left" ? 0 : undefined,
            right: props.side === "right" ? 0 : undefined,
        }}>
            <Container top bottom right>
                <div className={styles.sideNavContent}>
                    <a href="javascript:void(0)" className={styles.closebtn} onClick={() => setOpen(false)}>&times;</a>
                    {props.children}
                </div>
            </Container>
        </div>
    )
}

interface SliderInputProps {
    title: string;
    value: string;
    options: string[];
    onChange: (value: string) => void;
}

export function SliderInput(props: SliderInputProps) {
    const next = () => {

        // Check if the current value is the last in the array
        const currentIndex = props.options.indexOf(props.value);

        if(currentIndex === props.options.length - 1) {
            props.onChange(props.options[0]);
        } else {
            props.onChange(props.options[currentIndex + 1]);
        }
    }

    const prev = () => {

        // Check if the current value is the first in the array
        const currentIndex = props.options.indexOf(props.value);

        if(currentIndex === 0) {
            props.onChange(props.options[props.options.length - 1]);
        } else {
            props.onChange(props.options[currentIndex - 1]);
        }
    }

    return(
        <div className={styles.sliderContainer}>
            <h2>{props.title}</h2>
            <div className={styles.sliderOptions}>
                <button onClick={prev}>&lt;</button>
                <h3>{props.value}</h3>
                <button onClick={next}>&gt;</button>
            </div>
        </div>
    )
}

interface SliderInputNumberProps {
    title: string;
    value: number;
    min: number;
    max: number;
    onChange: (value: number) => void;
}

export function SliderInputNumber(props: SliderInputNumberProps) {


    const next = () => {

        // Check if the current value is the last in the array
        if(props.value < props.max) {
            props.onChange(props.value + 1);
        }
    }

    const prev = () => {

        // Check if the current value is the first in the array
        if(props.value > props.min) {
            props.onChange(props.value - 1);
        }
    }

    return(
        <div className={styles.sliderContainer}>
            <h2>{props.title}</h2>
            <div className={styles.sliderOptions}>
                <button onClick={prev}>&lt;</button>
                <h3>{props.value}</h3>
                <button onClick={next}>&gt;</button>
            </div>
        </div>
    )
}
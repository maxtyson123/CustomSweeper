import * as React from 'react';
import styles from '../styles/ui.module.css';


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
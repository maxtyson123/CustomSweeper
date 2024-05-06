import * as React from 'react';
import styles from '../styles/ui.module.css';

export function TopUI(){
    return (
        <>

            {/* Title UI */}
            <div className={styles.titleBar}>
                <h1> Customsweeper a</h1>
                <h2> Fully Customisable Mine Sweeper </h2>
                <h3> See also: 2048 WildCard</h3>
            </div>


            {/* Game Top UI */}
            <div className={styles.topBar}>
                <div className={styles.topBarLeft}>
                    <h1> Flags Left: </h1>
                    <span id={"flags-left"}></span>
                </div>
                <div className={styles.topBarRight}>
                    <h1> Time: </h1>
                    <span id={"time"}></span>
                </div>
            </div>
        </>
    );
}
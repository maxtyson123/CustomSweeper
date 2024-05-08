import React from "react";

interface SvgProps {
    width: number;
    height: number;
}

export function Mine(props: SvgProps) {

    return(
        <>
            <svg width={`${props.width}px`} height={`${props.height}px`} viewBox="0 0 64 64" aria-hidden="true" role="img" preserveAspectRatio="xMidYMid meet">

                <path d="M13.8 22.5C9.4 18.1 8 14.4 9.6 11.6c3.1-5.5 18-5.5 30.4-2.7l-.4 1.8C28 8.2 13.9 8.1 11.3 12.6c-1.4 2.5 1.3 6.1 3.9 8.7l-1.4 1.2" fill="#d3976e">

                </path>

                <g fill="#ffce31">

                    <path d="M41.2 11.3c-1 1-2 1.9-2.9 2.9c-.9.9.5 2.2 1.3 1.3c1-1 2-1.9 2.9-2.9c.9-.8-.4-2.2-1.3-1.3">

                    </path>

                    <path d="M46.8 8.5l2.9-2.9c.9-.9-.5-2.2-1.3-1.3l-2.9 2.9c-.9.8.4 2.1 1.3 1.3">

                    </path>

                    <path d="M45.4 12.6c1 1 2 1.9 2.9 2.9c.9.9 2.2-.5 1.3-1.3c-1-1-2-1.9-2.9-2.9c-.8-.9-2.2.5-1.3 1.3">

                    </path>

                    <path d="M38.3 5.6l2.9 2.9c.9.9 2.2-.5 1.3-1.3l-2.9-2.9c-.8-.9-2.2.5-1.3 1.3">

                    </path>

                </g>

                <g fill="#ed4c5c">

                    <path d="M43 14v2.9c0 1.2 1.9 1.2 1.9 0V14c0-1.2-1.9-1.2-1.9 0">

                    </path>

                    <path d="M43 2.9v2.8c0 1.2 1.9 1.2 1.9 0V2.9c0-1.2-1.9-1.2-1.9 0">

                    </path>

                    <path d="M48.2 10.8h2.9c1.2 0 1.2-1.9 0-1.9h-2.9c-1.2.1-1.2 1.9 0 1.9">

                    </path>

                </g>

                <path d="M10.7 24.2l6-5.9l3.8 3.7c3.5-2.4 7.8-3.7 12.4-3.7C45.1 18.2 55 28 55 40.1C55 52.2 45.1 62 32.8 62c-12.2 0-22.2-9.8-22.2-21.9c0-4.5 1.4-8.7 3.8-12.2l-3.7-3.7" fill="#3e4347">

                </path>

            </svg>
        </>
    )

}


export function Flag(props: SvgProps) {

    return(
        <>
            <svg width={`${props.width}px`} height={`${props.height}px`} viewBox="0 0 24 24" fill="none">

                <g id="SVGRepo_bgCarrier" strokeWidth="0"/>

                <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"/>

                <g id="SVGRepo_iconCarrier">
                    <path opacity="0.5" fillRule="evenodd" clipRule="evenodd"
                          d="M6.5 1.75C6.5 1.33579 6.16421 1 5.75 1C5.33579 1 5 1.33579 5 1.75V21.75C5 22.1642 5.33579 22.5 5.75 22.5C6.16421 22.5 6.5 22.1642 6.5 21.75V13.6V3.6V1.75Z"
                          fill="#ff0026"/>
                    <path
                        d="M13.5582 3.87333L13.1449 3.70801C11.5821 3.08288 9.8712 2.9258 8.22067 3.25591L6.5 3.60004V13.6L8.22067 13.2559C9.8712 12.9258 11.5821 13.0829 13.1449 13.708C14.8385 14.3854 16.7024 14.5119 18.472 14.0695L18.5721 14.0445C19.1582 13.898 19.4361 13.2269 19.1253 12.7089L17.5647 10.1078C17.2232 9.53867 17.0524 9.25409 17.0119 8.94455C16.9951 8.81543 16.9951 8.68466 17.0119 8.55553C17.0524 8.24599 17.2232 7.96141 17.5647 7.39225L18.8432 5.26136C19.1778 4.70364 18.6711 4.01976 18.0401 4.17751C16.5513 4.54971 14.9831 4.44328 13.5582 3.87333Z"
                        fill="#ff0026"/>
                </g>


            </svg>
        </>
    )
}

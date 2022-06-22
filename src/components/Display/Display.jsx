import React from 'react'
import classes from "./Display.module.css";

const Display = ({value}) => {
    return (
        <div className={classes.display} onClick={() => {
            navigator.clipboard.writeText(value).catch()
            alert("Copied to the clipboard!")
        }}>
            {value}
        </div>
    )
}

export default Display
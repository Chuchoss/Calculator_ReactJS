import React from "react"
import classes from "./OperationButton.module.css";

const OperationButton = ({sym, handle}) => {

    const handleButtonClick = (e) => {
        e.preventDefault()
        const val = e.target.value
        handle(val)
    }

    return (
        <button
            className={classes.button}
            type={'button'} value={sym}
            onClick={handleButtonClick}>

            {sym}
        </button>
    )
}

export default OperationButton

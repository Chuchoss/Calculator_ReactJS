import React, {useState} from "react";
import MyButton from "./components/MyButton/MyButton";
import Display from "./components/Display/Display";
import OperationButton from "./components/OperationButton/OperationButton";

const mainSymbols = [
  'C', '←', '%', '/',
  7, 8, 9, 'x',
  4, 5, 6, '-',
  1, 2, 3, '+',
  '±', 0, ',', '=',
]

const fixedNumberAmount = 5

const precisionDivisor = (len) => {
    let res = 1
    for (let i = 0; i < len; i++) res *= 10
    return res
}

const reduceAfterDotPart = (val, counter, f) => {
    const newCounter = counter - 1
    f(newCounter)
    return parseFloat(val.toFixed(newCounter))
}

export default function App() {
    const [display, setDisplay] = useState(0)
    const [equation, setEquation] = useState({fst: 0, snd: 0, op: undefined})
    const [postEq, setPostEq] = useState(false)
    const [dotMode, setDotMode] = useState(false)
    const [afterDotCounter, setAfterDotCounter] = useState(1)

    const updateEquation = (val) => {
        const parsed = parseInt(val)
        if (parsed || parsed === 0) {
            if (equation.op) {
                const newEquation = {
                    ...equation,
                    snd: (dotMode)
                        ? Number((equation.snd + parsed/precisionDivisor(afterDotCounter)).toFixed(afterDotCounter))
                        : equation.snd * 10 + parsed
                }
                setEquation(newEquation)
                setDisplay(newEquation.snd)
                if (postEq) setPostEq(false)
            }
            else {
                const newEquation = {
                    ...equation,
                    fst: (dotMode)
                        ? Number((equation.fst + parsed/precisionDivisor(afterDotCounter)).toFixed(afterDotCounter))
                        : equation.fst * 10 + parsed
                }
                setEquation(newEquation)
                setDisplay(newEquation.fst)
            }
            if (dotMode) setAfterDotCounter(afterDotCounter + 1)
        }
        else switch (val) {
            case 'C':
                setEquation({fst: 0, snd: 0, op: undefined})
                setDotMode(false)
                setAfterDotCounter(1)
                setDisplay(0)
                setPostEq(false)
                break
            case '←':
                if (dotMode && afterDotCounter <= 1) {
                    setDotMode(false)
                }
                if (equation.op && !postEq) {
                    const newEquation = {
                        ...equation,
                        snd: (dotMode)
                            ? reduceAfterDotPart(equation.snd, afterDotCounter, setAfterDotCounter)
                            : Math.floor(equation.snd / 10)
                    }
                    setEquation(newEquation)
                    setDisplay(newEquation.snd)
                    if (postEq) setPostEq(false)
                }
                else {
                    const newEquation = {
                        ...equation,
                        fst: (dotMode)
                            ? reduceAfterDotPart(equation.fst, afterDotCounter, setAfterDotCounter)
                            : Math.floor(equation.fst / 10)
                    }
                    setEquation(newEquation)
                    setDisplay(newEquation.fst)
                }
                break
            case '%':
                if (!dotMode) {
                    setDotMode(true)
                    setAfterDotCounter(3)
                }
                if (equation.op) {
                    const newEquation = {...equation, snd: equation.snd / 100}
                    setEquation(newEquation)
                    setDisplay(newEquation.snd)
                }
                else {
                    const newEquation = {...equation, fst: equation.fst / 100}
                    setEquation(newEquation)
                    setDisplay(newEquation.fst)
                }
                break
            case '=':
                const op = equation.op
                if (!op)
                    break

                const newEquation = (op === '-')
                    ? { fst: equation.fst - equation.snd, snd: 0, op}
                    : ((op === '+')
                        ? { fst: equation.fst + equation.snd, snd: 0, op}
                        : ((op === 'x')
                            ? { fst: equation.fst * equation.snd, snd: 0, op}
                            : { fst: equation.fst / equation.snd, snd: 0, op}))

                if (!Number.isInteger(newEquation.fst)) {
                    newEquation.fst = parseFloat(newEquation.fst.toFixed(fixedNumberAmount))
                    setAfterDotCounter(fixedNumberAmount + 1)
                }
                setEquation(newEquation)
                setDisplay(newEquation.fst)
                setPostEq(true)
                break
            case ",":
                if (dotMode) break
                setDotMode(true)
                break
            case "±":
                if (equation.op && !postEq) {
                    const newEquation = {...equation, snd: -equation.snd}
                    setEquation(newEquation)
                    setDisplay(newEquation.snd)
                }
                else {
                    const newEquation = {...equation, fst: -equation.fst}
                    setEquation(newEquation)
                    setDisplay(newEquation.fst)
                }
                break
            default:
                setAfterDotCounter(1)
                setDotMode(false)
                setEquation({...equation, op: val})
        }
    }


    return (
        <div className="container" key={99}>
            <Display value={display}/>
            {mainSymbols.map((sym, i) => (
                (['+', '-', '/', 'x', '='].includes(sym))
                    ?   <OperationButton handle={updateEquation} sym={sym} key={i}/>
                    :   <MyButton handle={updateEquation} sym={sym} key={i}/>
            ))}
        </div>
      )
}

import React, {useState, useRef, useEffect} from 'react';

import CircularProgress from '@mui/material/CircularProgress';

import CodeEditor from './CodeEditor';

import {compileCodeForMQF} from '../common';
import ErrorsAndWarnings from './ErrorsAndWarnings';
import EditorToolbar from './EditorToolbar';

const compileCheckDelay = 500;

export default function Visual({code, setCode}){
    const [errorsAndWarnings, setErrorsAndWarnings] = useState([]);
    const [codeIsValid, setCodeIsValid] = useState(false);
    const aceRef = useRef();

    useEffect( () => {
        const timeout = setTimeout(  () => {
            const {errorsAndWarnings, hasError} = compileCodeForMQF(code);
            setErrorsAndWarnings(()=>errorsAndWarnings);
            setCodeIsValid(!hasError);
        }, compileCheckDelay);

        setCodeIsValid(false);

        return () => clearTimeout(timeout);
    }, [code]);



    let displayElements = null;
    if (code===null){
        displayElements = (
            <div style={{flexGrow: 1, display: 'flex', alignContent: 'center', justifyContent:'center', alignItems:'center', justifyItems:'center'}}>
                <CircularProgress/>
            </div>
        );
    }else{
        displayElements = (
            <div style={{flexGrow: 1, display: 'flex', flexDirection: 'column'}}>
                <EditorToolbar aceRef={aceRef} code={code} codeIsValid={codeIsValid}/>
                <CodeEditor defaultCode={code} setCode={setCode} aceRef={aceRef} errorsAndWarnings={errorsAndWarnings}/>
                <ErrorsAndWarnings errorsAndWarnings={errorsAndWarnings} aceRef={aceRef}/>
            </div>
        );
    }

    return displayElements;
}
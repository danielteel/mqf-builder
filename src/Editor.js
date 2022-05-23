import React, {useState, useRef, useEffect} from 'react';

import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import { Typography } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';

import AceEditor from "react-ace";

import compile from './compiler/compile';

export default function Editor({code, setCode}){
    const [errorsAndWarnings, setErrorsAndWarnings]=useState([]);
    const aceRef = useRef();

    const codeChanged = (newValue) => {
        setCode( newValue );
    }

    useEffect( () => {
        const timeout = setTimeout( async () => {
            const retVal = await compile(code, true);
            setErrorsAndWarnings(()=>[]);
            if (retVal.error){
                setErrorsAndWarnings( () => [retVal.error])
            }
            if (retVal.warnings){
                if (retVal.warnings) setErrorsAndWarnings((prev)=>[...prev, ...retVal.warnings]);
            }
        }, 50);

        return () => clearTimeout(timeout);
    }, [code]);

    useEffect( () => {
        if (!aceRef.current?.editor) return;
        aceRef.current.editor.resize();
        aceRef.current.editor.getSession().clearBreakpoints();
        for (const errorOrWarning of errorsAndWarnings){
            aceRef.current.editor.getSession().setBreakpoint(errorOrWarning.line-1);
        }
    }, [errorsAndWarnings])

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
                <AceEditor
                    ref={aceRef}
                    defaultValue={code}
                    onChange={codeChanged}
                    mode="mqfl"
                    theme="monokai"
                    style={{flexGrow: 1, minHeight: '10px'}}
                    width='100%'
                    fontSize={14}
                    highlightActiveLine={true}
                    setOptions={{
                        showGutter: true,
                        showPrintMargin: false,
                        showLineNumbers: true,
                        tabSize: 4,
                        wrapBehavioursEnabled: true,
                        wrap: true
                    }}
                />
                <List dense sx={{maxHeight: '10em', overflowY: 'scroll'}}>
                    {
                        errorsAndWarnings.map( (errorOrWarning, index) => (
                            <ListItemButton key={errorOrWarning+'-'+index.toString()} onClick={()=>{aceRef.current.editor.gotoLine(errorOrWarning.line);}}>
                                <Typography sx={{color: errorOrWarning.type==='warning'?'warning.main':'error.main'}}>
                                    {errorOrWarning.message}
                                </Typography>
                            </ListItemButton>
                        ))
                    }
                </List>
            </div>
        );
    }

    return displayElements;
}
import React, {useState, useRef, useEffect} from 'react';

import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';

import AceEditor from "react-ace";

import compile from './compiler/compile';


import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/mode-text';
import 'ace-builds/src-noconflict/theme-monokai';

import { Typography } from '@mui/material';



function App() {
    const [errorsAndWarnings, setErrorsAndWarnings]=useState([]);
    const [code, setCode] = useState('');
    const aceRef = useRef();


    useEffect( () => {
        aceRef.current.editor.getSession().$mode.$highlightRules.$rules.start.unshift({token : "comment", regex : /^\s*>.*$/gm});
    }, [aceRef.current]);

    const codeChanged = (newValue) => {
        setCode(()=>newValue);
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
        aceRef.current.editor.resize();
        aceRef.current.editor.getSession().clearBreakpoints();
        for (const errorOrWarning of errorsAndWarnings){
            aceRef.current.editor.getSession().setBreakpoint(errorOrWarning.line-1);
        }
    }, [errorsAndWarnings])

    return (
        <Container sx={{height: '100vh', display: 'flex', flexDirection:'column'}}>
            <AceEditor
                ref={aceRef}
                onChange={codeChanged}
                mode="text"
                theme="monokai"
                style={{flexGrow: 1}}
                width='100%'
                debounceChangePeriod={200}
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
            <List dense sx={{maxHeight: '200px', overflowY: 'scroll'}}>
            {
                errorsAndWarnings.map( errorOrWarning=> (
                    <ListItemButton onClick={()=>{aceRef.current.editor.gotoLine(errorOrWarning.line);}}>
                        <Typography sx={{color: errorOrWarning.type==='warning'?'warning.main':'error.main'}}>
                            {errorOrWarning.message}
                        </Typography>
                    </ListItemButton>
                ))
            }
            </List>
        </Container>
    );
}

export default App;

import React, {useState, useEffect, useRef} from 'react';

import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import LinearProgress from '@mui/material/LinearProgress';

import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import CodeIcon from '@mui/icons-material/Code';
import TableRowsIcon from '@mui/icons-material/TableRows';
import SettingsIcon from '@mui/icons-material/Settings';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';

import Editor from './Editor';

import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/mode-text';
import 'ace-builds/src-noconflict/theme-monokai';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';



require(`./mode-mqfl`);


function App() {
    const [code, _setCode] = useState(null);
    const [codeIsNotSaved, setCodeIsNotSaved] = useState(false);
    const localStorageTimeoutIdRef = useRef();

    const setCode = (newCode) => {
        _setCode( () => {
            if (localStorageTimeoutIdRef.current){
                clearTimeout(localStorageTimeoutIdRef.current);
                localStorageTimeoutIdRef.current=null;
            }

            setCodeIsNotSaved(true);

            const timeoutId = setTimeout( () => {
                console.log("get fucked");
                localStorage.setItem('mqf-builder-code', newCode);
                localStorageTimeoutIdRef.current=null;
                setCodeIsNotSaved(false);
            }, 1000);

            localStorageTimeoutIdRef.current=timeoutId;
            return newCode;
        });
    }

    useEffect( () => {
        localStorageTimeoutIdRef.current = null;
        setTimeout( () => {
            const loadedCode = localStorage.getItem('mqf-builder-code');
            _setCode(loadedCode);
        }, 500);
    }, []);




    return (
        <Container sx={{height: '100%', display: 'flex', flexDirection:'column'}}>
            <AppBar position='sticky'>
                <Toolbar>
                MQF Builder
                </Toolbar>
            </AppBar>
            {
                codeIsNotSaved
                ?
                    <LinearProgress color='warning'/>
                :
                    <LinearProgress color='success' variant='determinate' value={100}/>
            }
            <Paper sx={{height: '100%', display: 'flex', flexDirection:'column'}}>
                <Editor code={code} setCode={setCode}/>
            </Paper>
            <BottomNavigation showLabels>
                <BottomNavigationAction label="Code" icon={<CodeIcon/>} />
                <BottomNavigationAction label="Questions" icon={<TableRowsIcon/>} />
                <BottomNavigationAction label="Documentation" icon={<QuestionMarkIcon/>} />
                <BottomNavigationAction label="Options" icon={<SettingsIcon />} />
            </BottomNavigation>
        </Container>
    );
}

export default App;

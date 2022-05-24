import React, {useState, useEffect, useRef} from 'react';

import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import LinearProgress from '@mui/material/LinearProgress';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import CodeIcon from '@mui/icons-material/Code';
import TableRowsIcon from '@mui/icons-material/TableRows';
import SettingsIcon from '@mui/icons-material/Settings';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';

import Editor from './Editor';
import Questions from './Questions';

import 'ace-builds/src-noconflict/theme-monokai';
import { Typography } from '@mui/material';
require(`./mode-mqfl`);

const screens = [
    {
        label: 'Code',
        icon: <CodeIcon/>
    },
    {
        label: 'Questions',
        icon: <TableRowsIcon/>
    },
    {
        label: 'Documentation',
        icon: <QuestionMarkIcon/>
    },
    {
        label: 'Options',
        icon: <SettingsIcon/>

    }
]

function App() {
    const [code, _setCode] = useState(null);
    const [codeIsNotSaved, setCodeIsNotSaved] = useState(false);
    const localStorageTimeoutIdRef = useRef();
    
    const [screen, setScreen] = useState(0);

    const onNavigate = (e, id) => {
        setScreen(id);
    }

    const setCode = (newCode) => {
        _setCode( () => {
            if (localStorageTimeoutIdRef.current){
                clearTimeout(localStorageTimeoutIdRef.current);
                localStorageTimeoutIdRef.current=null;
            }

            setCodeIsNotSaved(true);

            const timeoutId = setTimeout( () => {
                localStorage.setItem('mqf-builder-code', newCode);
                localStorageTimeoutIdRef.current=null;
                setCodeIsNotSaved(false);
            }, 500);

            localStorageTimeoutIdRef.current=timeoutId;
            return newCode;
        });
    }

    useEffect( () => {
        localStorageTimeoutIdRef.current = null;
        setTimeout( () => {
            let loadedCode = localStorage.getItem('mqf-builder-code');
            if (loadedCode===null) loadedCode='';
            _setCode(loadedCode);
        }, 500);
    }, []);


    let screenRender = null;

    switch (screens[screen].label){
        case 'Code':
            screenRender=<Editor code={code} setCode={setCode}/>;
            break;
        case 'Questions':
            screenRender=<Questions code={code} setCode={setCode}/>
            break;
        case 'Documentation':
            break;
        case 'Options':
            break;
        default:
            throw Error("not a valid screen, "+screen.label);
    }



    return (
        <Container sx={{height: '100%', display: 'flex', flexDirection:'column'}}>
            <AppBar position='sticky'>
                <Toolbar>
                    <Typography variant='h5'>MQF Builder</Typography>
                </Toolbar>
            </AppBar>
            {
                codeIsNotSaved
                ?
                    <LinearProgress color='warning'/>
                :
                    <LinearProgress color='success' variant='determinate' value={100}/>
            }
            <Paper sx={{height: '100%', display: 'flex', flexDirection:'column', overflow: 'auto'}}>
                {screenRender}
            </Paper>
            <BottomNavigation showLabels onChange={onNavigate} value={screen}>
                {
                    screens.map( screen => {
                        return <BottomNavigationAction key={screen.label} label={screen.label} icon={screen.icon} />
                    })
                }
            </BottomNavigation>
        </Container>
    );
}

export default App;

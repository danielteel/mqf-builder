import React, {useState, useEffect, useRef} from 'react';

import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import LinearProgress from '@mui/material/LinearProgress';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import CodeIcon from '@mui/icons-material/Code';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';

import Editor from './Editor';
import Documentation from './Documentation';

import 'ace-builds/src-noconflict/theme-monokai';
import Typography from '@mui/material/Typography';
require(`../mode-mqfl`);

const defaultCode = `!This will be the title text of the generated html application

:Question Section 1

  When should "they're" be used?
  Reference: English
    A. When you imply ownership
    B. When its a location
    C. When you would write they are
    Ans: C

  Whats an adjective?
   *A. a phrase naming an attribute
    B. a word or group of words that can be used to replace a noun or noun phrase
    C. a word or phrase that modifies or qualifies an adjective, verb, or other adverb or a word group, expressing a relation of place, time, circumstance, manner, cause, degree, etc. (e.g., gently, quite, then, there ).
   *D. A word naming an attribute

:Question Section 2

  Is 5 bigger than 3?
    Ref: Math book
    A. Yes
    B. No
    Answer: A`

const screens = [
    {
        label: 'Code',
        icon: <CodeIcon/>
    },
    {
        label: 'Documentation',
        icon: <QuestionMarkIcon/>
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
            if (loadedCode===null) loadedCode=defaultCode;
            _setCode(loadedCode);
        }, 500);
    }, []);


    let screenRender = null;

    switch (screens[screen].label){
        case 'Code':
            screenRender=<Editor code={code} setCode={setCode}/>;
            break;
        case 'Documentation':
            screenRender=<Documentation/>
            break;
        default:
            throw Error("not a valid screen, "+screen.label);
    }


    return (
        <Container sx={{height: '100%', display: 'flex', flexDirection:'column'}}>
            <AppBar position='sticky'>
                <Toolbar>
                    <Typography variant='h5'>MQF Builder</Typography>
                    <Typography varient='caption' sx={{marginLeft:'auto', color:'#55555555'}}>Dan Teel</Typography>
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

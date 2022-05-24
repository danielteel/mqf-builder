import React, {useState, useRef, useEffect} from 'react';

import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import SearchIcon from '@mui/icons-material/Search';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';

import AceEditor from "react-ace";

import {compileCodeForMQF, isAlpha} from './common';

export default function Editor({code, setCode}){
    
    const [errorsAndWarnings, setErrorsAndWarnings] = useState([]);

    const aceRef = useRef();

    useEffect( () => {
        const timeout = setTimeout(  () => {
            const {errorsAndWarnings} = compileCodeForMQF(code);
            setErrorsAndWarnings(()=>errorsAndWarnings);
        }, 500);

        return () => clearTimeout(timeout);
    }, [code]);

    const codeChanged = (newValue) => {
        setCode( newValue );
    }

    useEffect( () => {
        if (!aceRef.current?.editor) return;
        aceRef.current.editor.resize();
        aceRef.current.editor.getSession().clearBreakpoints();
        for (const errorOrWarning of errorsAndWarnings){
            aceRef.current.editor.getSession().setBreakpoint(errorOrWarning.line-1);
        }
    }, [errorsAndWarnings]);

    const prettify = () => {
        const {hasError, mqfList} = compileCodeForMQF(code);
        if (hasError){
            alert('Cant prettify when theres an error!');
            return;
        }

        let newCode='';

        const choiceLoopFn = (correct, choice, index) => {
            if (correct.includes(index)){
                newCode+='   *'+String.fromCharCode('A'.charCodeAt()+index)+'. '+choice+'\n';
            }else{
                newCode+='    '+String.fromCharCode('A'.charCodeAt()+index)+'. '+choice+'\n';
            }
        };

        for (const item of mqfList){
            switch (item?.type){
                case 'comment':
                    newCode+='>'+item.data+'\n';
                    break;
                case 'stripto':
                    newCode+='@stripto '+item.data+'\n\n';
                    break;
                case 'stripnum':
                    newCode+='@stripnum '+item.data+'\n\n';
                    break;
                case 'title':
                    newCode+='!'+item.data+'\n\n';
                    break;
                case 'section':
                    newCode+=':'+item.data+'\n\n';
                    break;
                case 'question':
                    if (isAlpha(item.data.question[0]) && item.data.question[1]==='.'){
                        newCode+='  ?'+item.data.question+'\n';
                    }else{
                        newCode+='  '+item.data.question+'\n';
                    }
                    newCode+='    Ref:'+item.data.ref+'\n';

                    item.data.choices.forEach(choiceLoopFn.bind(null, item.data.correct));
                    newCode+='\n';
                    break;
                default:
                    throw Error('unexpected mqfList type of '+item.type);
            }
        }
        newCode=newCode.trim();

        aceRef.current.editor.setValue(newCode, -1);
    }

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
                <Box style={{display:'flex'}}>
                    <input type='button' value='Prettify' onClick={prettify}/>
                    <div style={{flexGrow:1}}></div>
                    <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                        <TextField placeholder="Find..." variant="standard"/>
                        <IconButton>
                            <SearchIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }}/>
                        </IconButton>
                    </Box>
                </Box>
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
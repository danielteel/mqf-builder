import React, {useState, useRef, useEffect} from 'react';

import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

import FindText from './FindText';
import CodeEditor from './CodeEditor';

import {compileCodeForMQF, isAlpha} from './common';
import ErrorsAndWarnings from './ErrorsAndWarnings';


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


    const prettify = () => {
        const {hasError, mqfList} = compileCodeForMQF(code);
        if (hasError){
            alert('Cant prettify when theres an error!');
            return;
        }

        let newCode='';

        const choiceLoopFn = (correct, choice, index) => {
            if (correct.length>1 && correct.includes(index)){
                newCode+='   *'+String.fromCharCode('A'.charCodeAt()+index)+'. '+choice+'\n';
            }else{
                newCode+='    '+String.fromCharCode('A'.charCodeAt()+index)+'. '+choice+'\n';
            }
        };

        for (const [index, item] of mqfList.entries()){
            const nextItem=mqfList[index+1]?.type;
            switch (item?.type){
                case 'comment':
                    newCode+='>'+item.data+'\n';
                    if (nextItem!=='comment') newCode+='\n';
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
                    if (item.data.ref) newCode+='    Ref: '+item.data.ref+'\n';

                    item.data.choices.forEach(choiceLoopFn.bind(null, item.data.correct));
                    if (item.data.correct.length===1){
                        newCode+='    Ans: '+String.fromCharCode('A'.charCodeAt()+item.data.correct[0])+'\n'
                    }
                    newCode+='\n';
                    break;
                default:
                    throw Error('unexpected mqfList type of '+item.type);
            }
        }
        newCode=newCode.trimEnd();
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
                    <FindText aceRef={aceRef}/>
                </Box>
                <CodeEditor defaultCode={code} setCode={setCode} aceRef={aceRef} errorsAndWarnings={errorsAndWarnings}/>
                <ErrorsAndWarnings errorsAndWarnings={errorsAndWarnings} aceRef={aceRef}/>
            </div>
        );
    }

    return displayElements;
}
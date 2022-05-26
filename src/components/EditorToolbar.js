import React from 'react';

import Box from '@mui/material/Box';
import FindText from './FindText';

import {prettify} from '../common';

export default function EditorToolbar({aceRef, code, codeIsValid}){

    const prettifyClick = () => {
        const newCode = prettify(code);
        if (newCode){
            aceRef.current.editor.setValue(newCode, -1);
        }else{
            alert('Error generating prettified code');
        }
    }

    return (
        <Box style={{display:'flex'}}>
            <input type='button' value='Prettify' onClick={prettifyClick} disabled={!codeIsValid}/>
            <div style={{flexGrow:1}}></div>
            <FindText aceRef={aceRef}/>
        </Box>
    );
}
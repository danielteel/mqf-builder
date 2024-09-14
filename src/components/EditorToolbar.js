import React, {useRef} from 'react';

import Stack from '@mui/material/Stack';
import FindText from './FindText';
import BuildIcon from '@mui/icons-material/Build';
import CodeIcon from '@mui/icons-material/Code';
import DownloadIcon from '@mui/icons-material/Download';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import { saveAs } from "file-saver";

import {prettify, compileHTML} from '../common';

export default function EditorToolbar({aceRef, code, codeIsValid}){
    const inputFileRef = useRef();

    const saveFile = () => {
        saveAs(new Blob([code]), 'mqf.txt');
    }

    const prettifyClick = () => {
        const newCode = prettify(code);
        if (newCode){
            aceRef.current.editor.setValue(newCode, -1);
        }else{
            alert('Error generating prettified code');
        }
    }
    
    const onFileChanged = (e) => {
        e.preventDefault();
        const reader = new FileReader();
        reader.onload = (e) => {
          const text = e.target.result;
          aceRef.current.editor.setValue(text, -1);
        };
        reader.readAsText(e.target.files[0]);
        inputFileRef.current.value=null;
    }

    const compileAndDownload = async (e) => {
        const html = await compileHTML(code);
        if (html){
            saveAs(new Blob([html]), 'mqf.html');
        }
    }

    return (
        
        <Stack direction='row' sx={{my: '3px'}} alignItems='center'>
            <input type="file" ref={inputFileRef} style={{ display: "none" }} onChange={onFileChanged}/>
            <ToggleButtonGroup size="medium">
                <Tooltip title="Open File">
                    <ToggleButton value='open' onClick={()=>inputFileRef.current.click()}>
                        <FolderOpenIcon/>
                    </ToggleButton>
                </Tooltip>
                <Tooltip title="Download Code">
                    <ToggleButton value='save' onClick={saveFile}>
                        <DownloadIcon/>
                    </ToggleButton>
                </Tooltip>
            </ToggleButtonGroup>
            <Divider flexItem orientation="vertical" sx={{ mx: 0.5, my: 1 }} />
            <ToggleButtonGroup size="medium">
                <Tooltip title={codeIsValid?"Format and prettify code":"Fix errors before you can format and prettify"}>
                    <span>
                        <ToggleButton value='prettify' onClick={prettifyClick} disabled={!codeIsValid}>
                            <CodeIcon/>
                        </ToggleButton>
                    </span>
                </Tooltip>
            </ToggleButtonGroup>
                
            <Divider flexItem orientation="vertical" sx={{ mx: 0.5, my: 1 }} />
            <ToggleButtonGroup size="medium">
                <Tooltip title={codeIsValid?"Compile to HTML App":"Fix errors before you can compile"}>
                    <span>
                        <ToggleButton value='build' disabled={!codeIsValid} onClick={compileAndDownload}>
                            <BuildIcon/>
                        </ToggleButton>
                    </span>
                </Tooltip>
            </ToggleButtonGroup>
            <div style={{flexGrow: 1}}/>
            <FindText aceRef={aceRef}/>
        </Stack>
    );
}
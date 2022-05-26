import React, {useState} from 'react';

import SearchIcon from '@mui/icons-material/Search';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';

export default function FindText({aceRef}){
    const [findText, _setFindText] = useState(()=>localStorage.getItem('mqf-builder-find'));
    const setFindText = (text) => {
        _setFindText(text);
        localStorage.setItem('mqf-builder-find', text);
    }
    return (
        <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
            <TextField placeholder="Find..." variant="standard" value={findText} onChange={(e)=>setFindText(e.target.value)} onKeyDown={(e)=>{
                if (e.key==='Enter') aceRef.current.editor.find(findText);
            }}/>
            <IconButton onClick={()=>aceRef.current.editor.find(findText)}>
                <SearchIcon sx={{ color: 'action.active'}}/>
            </IconButton>
        </Box>
    );
}
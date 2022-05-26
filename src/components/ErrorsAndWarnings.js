import React from 'react';

import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import Typography from '@mui/material/Typography';

export default function ErrorsAndWarnings({errorsAndWarnings, aceRef}){
    return (
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
    );
}
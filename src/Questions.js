import React, {useState, useEffect} from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';

import { compileCodeForMQF } from './common';



export default function Questions({code, setCode}){ 
    const [hasError, setHasError] = useState(false);
    const [mqf, setMqf] = useState({sections: []});

    useEffect( () => {
        const {mqf, hasError} = compileCodeForMQF(code);
        setHasError(hasError);
        setMqf(mqf);
    }, [code]);

    if (hasError){
        return (
            <div style={{flexGrow: 1, display: 'flex', justifyContent:'center', alignItems:'center'}}>
                <Typography variant='h6' sx={{color:'warning.main'}}>Fix all errors in the code before you can use this tool</Typography>
            </div>
        );
    }

    return (
            mqf.sections.map( (section, index) => (
                <Accordion key={section+'-'+index} disableGutters>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography>{section.name}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        {
                            section.questions.map( (question, index) => (
                                <Accordion key={question.question+'-'+index+question.num} defaultExpanded disableGutters>
                                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                        <Typography>{question.question}</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Typography sx={{color: '#ee9900'}}>Ref: {question.ref}</Typography>
                                        {
                                            question.choices.map( (choice, index) => (
                                                <FormGroup key={choice+index}>
                                                    <FormControlLabel
                                                        label={choice}
                                                        control={<Checkbox inputProps={{label: choice}} defaultChecked={question.correct.includes(index)} />}
                                                    />
                                                </FormGroup>
                                            ))
                                        }
                                    </AccordionDetails>
                                </Accordion>
                            ))
                        }
                    </AccordionDetails>
                </Accordion>
            ))
    );
}
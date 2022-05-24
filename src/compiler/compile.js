import Parser from './parser';
import Tokenizer from './tokenizer';

import shellStartFile from './data/shellStart.txt';
import shellEndFile from './data/shellEnd.txt';

let shellStart=null;
let shellEnd=null;

export default async function compile(text, justJSON=false){
    if (!justJSON){
        try {
            if (!shellStart){
                shellStart=await (await fetch(shellStartFile)).text();
            }
            if (!shellEnd){
                shellEnd=await (await fetch(shellEndFile)).text();
            }
        } catch (e) {
            return {error: 'failed to fetch shell strings'};
        }
    }

    let tokens;
    try {
        tokens=Tokenizer.tokenize(text);
    } catch (e) {
        return {error: e};
    }

    let mqf, warnings;
    try {
        ({mqf, warnings} = Parser.parse(tokens));
    } catch (e) {
        return {error: e};
    }

    try {
        if (justJSON){
            const htmlMQF=JSON.stringify(mqf, null, '    ');
            return {value: htmlMQF, warnings: warnings, mqf: mqf};
        }else{
            const htmlMQF=JSON.stringify(mqf).replaceAll("'", "\\'");
            return {value: shellStart+htmlMQF+shellEnd, warnings: warnings, mqf: mqf};
        }
    } catch (e) {
        return {error: 'failed to stringify mqf into JSON'};
    }
}


export function compileMQF(text){
    let tokens;
    try {
        tokens=Tokenizer.tokenize(text);
    } catch (e) {
        return {error: e};
    }

    try {
        const {mqf, mqfList, warnings} = Parser.parse(tokens);
        return {warnings, mqf, mqfList};
    } catch (e) {
        return {error: e};
    }
}
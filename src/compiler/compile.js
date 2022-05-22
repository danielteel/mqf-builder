import Parser from './parser';
import Tokenizer from './tokenizer';

import shellStartFile from './data/shellStart.txt';
import shellEndFile from './data/shellEnd.txt';

let shellStart=null;
let shellEnd=null;

export default async function compile(text, justJSON=false){
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

    let tokens;
    try {
        tokens=Tokenizer.tokenize(text);
    } catch (e) {
        return {error: e};
    }

    let mqf;
    try {
        mqf=Parser.parse(tokens);
    } catch (e) {
        return {error: e};
    }

    try {
        if (justJSON){
            const htmlMQF=JSON.stringify(mqf, null, '    ');
            return {value: htmlMQF};
        }else{
            const htmlMQF=JSON.stringify(mqf).replaceAll("'", "\\'");
            return {value: shellStart+htmlMQF+shellEnd};
        }
    } catch (e) {
        return {error: 'failed to stringify mqf into JSON'};
    }
}
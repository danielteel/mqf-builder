
import {compileMQF} from './compiler/compile';

export function isAlpha(character){
    const charCode=character.charCodeAt(0);
    if ((charCode>=65 && charCode<=90) || (charCode>=97 && charCode<=122)){
        return true;
    }
    return false;
}

export function compileCodeForMQF(code){
    const {error, warnings, mqf, mqfList} = compileMQF(code);
    const errorsAndWarnings = [];

    if (error){
        errorsAndWarnings.push(error);
    }
    if (warnings){
        errorsAndWarnings.push(...warnings);
    }
    return {mqf, mqfList, errorsAndWarnings, hasError: !!error, hasWarning: !!warnings?.length};
}
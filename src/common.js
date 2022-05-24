
import {compileMQF} from './compiler/compile';

export function isAlpha(character){
    const charCode=character.charCodeAt(0);
    if ((charCode>=65 && charCode<=90) || (charCode>=97 && charCode<=122)){
        return true;
    }
    return false;
}

export function compileCodeForMQF(code){
    const retVal = compileMQF(code);
    const errorsAndWarnings = [];

    if (retVal.error){
        errorsAndWarnings.push(retVal.error);
    }
    if (retVal.warnings){
        errorsAndWarnings.push(...retVal.warnings);
    }
    return {mqf: retVal.mqf, errorsAndWarnings, hasError: !!retVal.error, hasWarning: !!retVal.warnings?.length};
}
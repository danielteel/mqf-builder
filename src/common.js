
import compile, {compileMQF} from './compiler/compile';

export function isAlpha(character){
    const charCode=character.charCodeAt(0);
    if ((charCode>=65 && charCode<=90) || (charCode>=97 && charCode<=122)){
        return true;
    }
    return false;
}

export async function compileHTML(code){
    const {value, error} = await compile(code);
    if (error) return null;
    return value;
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

export function prettify(code){
    const {hasError, mqfList} = compileCodeForMQF(code);
    if (hasError){
        return null;
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
    
    return newCode.trimEnd();
}
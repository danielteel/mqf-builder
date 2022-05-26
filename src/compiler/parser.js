import {TokenType} from './common';

export default class Parser {

    static parse(tokens){
        const parser=new Parser(tokens);
        parser.parse();
        return {mqf: parser.mqf, mqfList: parser.mqfList, warnings: parser.warnings};
    }

    constructor(tokens){
        this.tokens=tokens;
    }

    parse(){
        this.title=null;
        this.stripNum=0;
        this.stripChar=null;
        this.mqf={sections:[]};
        this.mqfList=[];
        this.warnings=[];

        if (this.tokens.length<=0) return;
        this.token=null;
        this.tokenIndex=-1;
        this.getToken();
        this.doMQF();
        if (!this.mqf.title) this.mqf.title='MQF';
    }

    addWarning(message){
        this.warnings.push({message: 'Warning near line '+this.token.line+': '+message, line: this.token.line, type: 'warning'});
    }

    throwError(message) {
		let errorLine;
		if (this.token){
			errorLine=this.token.line;
		}else{
			errorLine=this.tokens[this.tokens.length-1].line;//Probably ran to the end of the token buffer, so just grab the last code line
		}
        const error={message: "Parser error on or near line "+errorLine+": "+message, line: errorLine};
		throw error;
	}
    
	symbolToString(sym){
		return sym?sym.toString().replace("Symbol",""):null;
	}

	match(type) {
		if (this.token ? this.token.type === type : null) {
            const retVal = this.token.value;
			this.getToken();
            return retVal;
		}else{
			if (this.token){
				this.throwError("expected token type "+ this.symbolToString(type) + " but found "+this.symbolToString(this.token?this.token.type:null)+" instead");
			}else{
				this.throwError("expected token type "+ this.symbolToString(type) + " but found nothing!");
			}
		}
	}

    getToken(){
        this.tokenIndex++;
        if (this.tokenIndex>=this.tokens.length-1) this.token=null;
        this.token=this.tokens[this.tokenIndex];
        if (this.token && this.token.type===TokenType.End) this.token=null;
    }

    doQuestion(){
        if (this.mqf.sections.length<=0){
            this.mqf.sections.push({name: 'Questions', questions: []});
        }
        let question=this.match(TokenType.Question);
        let preservedQuestion=question;
        if (this.stripChar){
            const index=question.indexOf(this.stripChar);
            if (index>=0){
                question=question.slice(index+this.stripChar.length+this.stripNum).trim();
            }
        }else{
            if (this.stripNum>=0){
                question=question.slice(this.stripNum).trim();
            }
        }
        let expectAnswerIndex=0;
        const answers=[];
        let ref=null;
        const correct=[];
        let correctExplicit=null;
        let comments = [];

        while (this.token && (this.token.type===TokenType.Answer || this.token.type===TokenType.Comment || this.token.type===TokenType.Ref || this.token.type===TokenType.Correct || (answers.length===0 && this.token.type===TokenType.Question))){
            if (this.token.type===TokenType.Comment){
                comments.push({type: 'comment', data: this.match(TokenType.Comment)});                
            }else if (this.token.type===TokenType.Answer){
                const answer = this.match(TokenType.Answer);

                if (answer.id!==expectAnswerIndex){
                    this.throwError('answers need to be in alphabetical order and no duplicates');
                }

                answers.push(answer.text);
                if (answer.correct) correct.push(expectAnswerIndex);

                expectAnswerIndex++;

            }else if (this.token.type===TokenType.Ref){
                if (ref) this.throwError('cannot have more than one ref per question');
                ref=this.match(TokenType.Ref);
            }else if (this.token.type===TokenType.Correct){
                if (correctExplicit) this.throwError('you can only specify one explicit correct choice via "Answer: A/B/C/D/E/F" per question.');
                correctExplicit=this.match(TokenType.Correct);
            }else if (this.token.type===TokenType.Question){
                if (answers.length || correct.length || correctExplicit!==null | ref!=null){
                    this.throwError('expected an choice, correct answer, or ref but found a new question');
                }
                this.addWarning('attempting to fix possible multiline question, verify and consolidate to one line please');
                const appendThis=this.match(TokenType.Question);
                question+=appendThis;
                preservedQuestion+=appendThis;
            }
        }
        
        if (answers.length<2){
            this.throwError('questions need to have at least 2 possible answers');
        }

        if (correct.length<1 && correctExplicit===null){
            this.throwError('questions need to have at least 1 correct answer');
        }

        if (correctExplicit!==null && correct.length){
            this.throwError('you can only specify correct answer(s) via *s or explicit "Answer: <correct choice>", not both');
        }

        if (correctExplicit>=answers.length){
            this.throwError('attempted to specify a correct answer that doenst have an associated existing choice');
        }
        
        if (correctExplicit!==null){
            correct.push(correctExplicit);
        }

        const questions = this.mqf.sections[this.mqf.sections.length-1].questions;
        questions.push({num: questions.length+1, question: question, choices: answers, ref: ref, correct: correct});

        this.mqfList.push({type: 'question', data: {question: preservedQuestion, choices: answers, ref: ref, correct: correct}});
        this.mqfList.push(...comments);
    }


    doMQF(){
        while (this.token){
            switch (this.token.type){
                case TokenType.Comment:
                    this.mqfList.push({type: 'comment', data: this.match(TokenType.Comment)});
                    break;

                case TokenType.Title:
                    if (this.mqf.title){
                        this.throwError('already had a title defined, dont try and make another one!');
                    }
                    this.mqf.title=this.match(TokenType.Title);
                    this.mqfList.push({type: 'title', data: this.mqf.title})
                    break;

                case TokenType.StripTo:
                    this.stripChar=this.match(TokenType.StripTo);
                    this.mqfList.push({type: 'stripto', data: this.stripChar});
                    break;

                case TokenType.StripNum:
                    this.stripNum=this.match(TokenType.StripNum);
                    this.mqfList.push({type: 'stripnum', data: this.stripNum});
                    break;

                case TokenType.Section:
                    const sectionName = this.match(TokenType.Section);
                    this.mqf.sections.push({name: sectionName, questions:[]})
                    this.mqfList.push({type: 'section', data: sectionName});
                    break;

                case TokenType.Question:
                    this.doQuestion();
                    break;

                default:
                    this.throwError('unexpected token, '+this.symbolToString(this.token));
            }
        }
    }
}
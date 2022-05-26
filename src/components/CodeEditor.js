import React, {useEffect} from 'react';

import AceEditor from 'react-ace';


export default function CodeEditor({aceRef, errorsAndWarnings, defaultCode, setCode}){

    useEffect( () => {
        if (!aceRef.current?.editor) return;
        aceRef.current.editor.resize();
        aceRef.current.editor.getSession().clearBreakpoints();
        for (const errorOrWarning of errorsAndWarnings){
            aceRef.current.editor.getSession().setBreakpoint(errorOrWarning.line-1);
        }
    }, [errorsAndWarnings, aceRef]);

    return  <AceEditor
                ref={aceRef}
                defaultValue={defaultCode}
                onChange={setCode}
                mode='mqfl'
                theme='monokai'
                style={{flexGrow: 1, minHeight: '10px'}}
                width='100%'
                fontSize={14}
                height={null}
                highlightActiveLine={true}
                setOptions={{
                    showGutter: true,
                    showPrintMargin: false,
                    showLineNumbers: true,
                    tabSize: 4,
                    wrapBehavioursEnabled: true,
                    wrap: true
                }}
            />;
}
import React, {useState, useRef} from 'react';

import CodeEditor from '@uiw/react-textarea-code-editor';

import compile from './compiler/compile';



function App() {
  const [code, setCode] = useState('');
  const [json, setJSON] = useState('');
  const iframeRef = useRef();
  
  const handleChange = (e) => {
    setCode(e.target.value);
  }

  const compiledClick = async () => {
    const retVal = await compile(code, true);
    if (retVal.error){
      console.error("get fucked", retVal.error.message);
      setJSON(retVal.error.message);
    }else{
      setJSON(retVal.value);
    }
    
    const html = await compile(code);
    if (html.error){
      iframeRef.current.contentWindow.document.open();
      iframeRef.current.contentWindow.document.write('shits broke: '+html.error.message);
      iframeRef.current.contentWindow.document.close();
    }else{
      iframeRef.current.contentWindow.document.open();
      iframeRef.current.contentWindow.document.write(html.value);
      iframeRef.current.contentWindow.document.close();
    }
  }

  return (
    <div className="App" style={{width: '100vw', height: '100vh'}}>
        {
          //<textarea value={code} onChange={handleChange}/>
        }
        
        <CodeEditor
          value={code}
          language="js"
          onChange={handleChange}
          padding={0}
          style={{
            fontSize: 12,
            width:'100%',
            height: '100%',
            backgroundColor: "#f5f5f5",
            fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
          }}
        />
        <input type='button' value='Compile' onClick={compiledClick}/>
        {
          
          //<pre style={{width: '100vw', textAlign:'left'}}>{json}</pre>
          //<iframe ref={iframeRef} style={{width:'100vw', height: '100vh'}}></iframe>
        }
    </div>
  );
}

export default App;

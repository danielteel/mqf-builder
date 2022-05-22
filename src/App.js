import React, {useState, useRef} from 'react';
import compile from './compiler/compile';
import './App.css';


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
    <div className="App">
        <textarea value={code} onChange={handleChange}/>
        <input type='button' value='Compile' onClick={compiledClick}/>
        <pre style={{width: '100vw', textAlign:'left'}}>{json}</pre>
        <iframe ref={iframeRef} style={{width:'100vw', height: '100vh'}}></iframe>
    </div>
  );
}

export default App;

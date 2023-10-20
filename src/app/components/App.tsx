import React, {useState} from 'react';
import '../styles/ui.css';
import 'figma-plugin-ds/dist/figma-plugin-ds.css'


function App() {
  const [isComponentSelected, setSelectedComponent] = useState(null);
  let resetcomponentNameValue = null;
  let selectedcomponentNameValue = '';
  const resetcomponentNameRef = React.useRef<HTMLInputElement>(undefined);
  const selectedcomponentNameRef = React.useRef<HTMLParagraphElement>(undefined);

  const resetInstance = () => {
    resetcomponentNameValue = resetcomponentNameRef.current.value;
    parent.postMessage({ pluginMessage: { type: 'resetInstance', resetComponentNameValue: resetcomponentNameValue} }, '*');
  }  

  const resetInstances = () => {
    resetcomponentNameValue = resetcomponentNameRef.current.value;
    parent.postMessage({ pluginMessage: { type: 'resetInstances', resetComponentNameValue: resetcomponentNameValue} }, '*');
    // resetcomponentNameRef.current.value = resetcomponentNameValue;
  }  

  React.useEffect(() => {
    // This is how we read messages sent from the plugin controller

    window.onmessage = (event) => {
      const { type, message } = event.data.pluginMessage;
      
      if (type === 'resetInstances' || type === 'resetInstance') {
        console.log(`Figma Says: Instance/s Renamed`);
      }
      if (type === 'instanceSelected') {
        if(message){
          // when component selected reflect the changes on the UI
          resetcomponentNameValue = message.mainComponentName;
          resetcomponentNameRef.current.value = resetcomponentNameValue;
          selectedcomponentNameValue = message.selectedComponentName;
          selectedcomponentNameRef.current.innerHTML = selectedcomponentNameValue;
          setSelectedComponent(true);
        }
        else {
          // No component selected - reset values
          resetcomponentNameValue = null;
          resetcomponentNameRef.current.value = '';
          selectedcomponentNameValue = null
          selectedcomponentNameRef.current.innerHTML = '';
          setSelectedComponent(false);
          console.log(`No Component Selected`);
        }
      }
    };
  }, []);

  return (
    <div>
       <p className="type--xlarge mrg8-B">🔥 How to use:</p>
          <ol className="mrg0-T">
            <li className="type--small gray">Select one or more layers.</li>
            <li className="type--small gray">Run this plugin.</li>
            <li className="type--small gray">Enter new component name</li>
            <li className="type--small gray">Rename one particular instance or rename all instances on that page</li>
            <li className="type--small gray">Enjoy🤟</li>
          </ol>
        
        
        <div className="row column-gap-1">

          {/* User Selected Component */}
          <p className="type--xlarge type--bold	green column">Component Selected:</p>
          {!isComponentSelected && <p className="type--small red">Please select an instance</p>}
          <p ref={selectedcomponentNameRef} id="selectedComponentName" className="type--xlarge"></p>
        </div>
        
        {/* Main Component Name */}
        <div className="row column-gap-1">
          <p className="type--xlarge type--bold	green column">Reset Name to:</p>
          {/* <p ref={resetcomponentNameRef} id="resetComponentName" className="type--xlarge"></p> */}
          <input ref={resetcomponentNameRef} id="resetComponentName" className="input__field type--xlarge" />
        </div>

        {/* Actions */}
        <div className="row column-gap-1 space-around mrg24-T">
          <button className='button button--primary' onClick={resetInstance}>Reset This Instance</button>
          <button className='button button--secondary' onClick={resetInstances}>Reset All Instances</button>
        </div>
    </div>
  );
}

export default App;

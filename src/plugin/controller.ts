figma.showUI(__html__);
figma.ui.resize(410,350)
let selectedComponent;
let mainComponent;

function getSelection() {
  // get the user's selcetion and the main component of that selection
  if(figma.currentPage.selection && figma.currentPage.selection[0] && figma.currentPage.selection[0].type === 'INSTANCE')
  {
    selectedComponent =  figma.currentPage.selection[0];
    mainComponent = figma.currentPage.selection[0].mainComponent.parent ? figma.currentPage.selection[0].mainComponent.parent: figma.currentPage.selection[0].mainComponent;
    figma.ui.postMessage({ type: 'instanceSelected', message: {selectedComponentName: figma.currentPage.selection[0].name, mainComponentName: figma.currentPage.selection[0].mainComponent.parent ? figma.currentPage.selection[0].mainComponent.parent.name: figma.currentPage.selection[0].mainComponent.name} });
  }
  else
  figma.ui.postMessage({ type: 'instanceSelected', message: null });
}


figma.on("selectionchange", () => { 
  getSelection();
})

figma.on("run", () => { 
  getSelection();
})

figma.ui.onmessage = (msg) => {

  if (msg.type === 'resetInstance') {
    // selectedComponent.name = mainComponent.name
    selectedComponent.name = msg.resetComponentNameValue
    figma.ui.postMessage({ type: 'resetInstance' });
    figma.closePlugin("Instance Renamed")
  }

  if (msg.type === 'resetInstances') {
    const page = figma.currentPage;
    // && node.mainComponent.parent && node.mainComponent.parent.name === mainComponent.name
    const instances = page.findAll((node:any) => node.mainComponent && node.mainComponent.remote);
    let count = 0
    instances.forEach((instance:any) =>{
      if(instance.name != mainComponent.name){
      count +=1
      // instance.name = mainComponent.name
      instance.name = msg.resetComponentNameValue
      }
    }
    )
    figma.ui.postMessage({ type: 'resetInstances' });
    figma.closePlugin(count + " Instances Renamed")
  }

  figma.closePlugin();
};

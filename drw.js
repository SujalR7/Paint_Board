const canvas=document.querySelector("canvas");
toolBtn=document.querySelectorAll(".tools");
fillColor=document.querySelector("#fill-color");
sizeSlider=document.querySelector("#size-slider");
colors=document.querySelectorAll(".colors .option");
colorPickers=document.querySelectorAll("#color-picker");
clearCanvas=document.querySelector(".clear-canvas");
saveImg=document.querySelector(".save-img");
ctx=canvas.getContext("2d");
let isDrawing=false,brushWidth=5;
let selectedTool="brush";
let selectedColor="#000";
let prevMouseX,prevMouseY,snapshot;
const setCanvasBackground=()=>{
    ctx.fillStyle="#fff";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle=selectedColor;
}
window.addEventListener("load",()=>{
    //setting canvas width height offset width/height returns viewable width/height of an element
    canvas.width=canvas.offsetWidth;
    canvas.height=canvas.offsetHeight;
    setCanvasBackground();
})
const drawRect=(e)=>{
    if(!fillColor.checked){
      return ctx.strokeRect(e.offsetX,e.offsetY,prevMouseX-e.offsetX,prevMouseY-e.offsetY);
    }
    ctx.fillRect(e.offsetX,e.offsetY,prevMouseX-e.offsetX,prevMouseY-e.offsetY);
}
const drawCircle=(e)=>{
    ctx.beginPath();
    let radius=Math.sqrt(Math.pow((prevMouseX-e.offsetX),2)+Math.pow((prevMouseY-e.offsetY),2));
    ctx.arc(prevMouseX,prevMouseY,radius,0,2*Math.PI);
    if(!fillColor.checked){
      return ctx.stroke();
    }
    ctx.fill();
}
const drawTriangle=(e)=>{
    ctx.beginPath();
   ctx.moveTo(prevMouseX,prevMouseY);//moving triangle to mouse pointer
   ctx.lineTo(e.offsetX,e.offsetY);//creating first line according to mouse pointer
   ctx.lineTo(prevMouseX*2-e.offsetX,e.offsetY);//creating bottomline of triangle
   ctx.closePath();//closing path of triangle so the third line draw automatically
    fillColor.checked?ctx.fill():ctx.stroke();
}
const drawLine=(e)=>{
    ctx.beginPath();
    ctx.moveTo(prevMouseX,prevMouseY)
    ctx.lineTo(e.offsetX,e.offsetY); 
    ctx.stroke();
}
const drawcurveLine=(e)=>{
    ctx.beginPath();
    ctx.moveTo(prevMouseX,prevMouseY)
    ctx.quadraticCurveTo(prevMouseX,prevMouseY+200,e.offsetX,e.offsetY); 
    ctx.stroke();
}
const startDraw=(e)=>{
    isDrawing=true;
    prevMouseX=e.offsetX;
    prevMouseY=e.offsetY;
    ctx.beginPath();//creating new path to draw;
    ctx.lineWidth=brushWidth;
    ctx.strokeStyle=selectedColor;
    ctx.fillStyle=selectedColor;
    snapshot=ctx.getImageData(0,0,canvas.width,canvas.height);//copying the canvas data and passing as snapshot value,this avoid dragging the image
}
const stopDraw=()=>{
    isDrawing=false;
}
const drawing=(e)=>{
    if(!isDrawing) return;
    ctx.putImageData(snapshot,0,0);
    if(selectedTool==="brush" || selectedTool==="eraser")
    {
    ctx.strokeStyle=selectedTool==="eraser"?"#fff":selectedColor;
    ctx.lineTo(e.offsetX,e.offsetY);//creating line according to mouse pointer
    ctx.stroke();//drawing filling with color
    }
    else if(selectedTool==="rectangle"){
        drawRect(e);
    }
    else if(selectedTool==="circle"){
        drawCircle(e);
    }
    else if(selectedTool==="triangle"){
        drawTriangle(e);
    }
    else if(selectedTool==="line"){
        drawLine(e);
    }
    else if(selectedTool==="curve-line"){
        drawcurveLine(e);
    }

}
toolBtn.forEach((tool)=>{
    tool.addEventListener("click",()=>{
        document.querySelector(".option");
        selectedTool=tool.id;
        console.log(selectedTool)
    })
})
colors.forEach((color)=>{
    color.addEventListener("click",()=>{selectedColor=(window.getComputedStyle(color).getPropertyValue("background-color"));})
})
colorPickers.forEach((colorPicker)=>{colorPicker.addEventListener("change",()=>{
    colorPicker.parentElement.style.background=colorPicker.value;
    colorPicker.parentElement.click();
})})
clearCanvas.addEventListener("click",()=>{
    ctx.clearRect(0,0,canvas.width,canvas.height);
    setCanvasBackground();
})
saveImg.addEventListener("click",()=>{
    const link=document.createElement("a");
    link.download=`${Date.now()}.jpg`;
    link.href=canvas.toDataURL();
    link.click();
})
sizeSlider.addEventListener("change",()=>brushWidth=sizeSlider.value);
canvas.addEventListener("mousemove",drawing);
canvas.addEventListener("mousedown",startDraw);
canvas.addEventListener("mouseup",stopDraw);

import { useState } from "react";
import Lock from "./images/lock";
import Unlock from "./images/unlock";

export function AuroraScale({totalWidth, maxHeight, labels, scaleTitle, id, ids, onHover, lockedValueSetter}) {

    const [displayValueLock, setDvLock] = useState(['none', 'none', 'none', 'none', 'none']);
    const [displayValueUnlock, setDvUnlock] = useState(['none', 'none', 'none', 'none', 'none']);
    const [clicked, setClicked] = useState([false, false, false, false, false]);

    //// HANDLING LOCKS
    //function that updates any array from the three arrays above - if clicked, it will reset all values before doing anything
    const handleArrayUpdate = (index, value, array, arraySetter, clicked) => {
        const newArray = [...array];
        if(clicked){
            for(let i = 0; i <= 4; i++){
                if(value === false || value === true) newArray[i] = false;
                if(value === 'block' || value === 'none') newArray[i] = 'none';
            }
        }

        newArray[index] = value;
        arraySetter(newArray);
    }

    // handling hover - displaying the correct lock/unlock
    const handleMouseEnter = (e) => {
        onHover(e.target.id);
        if(!clicked[ids.indexOf(e.target.id)]) handleArrayUpdate(ids.indexOf(e.target.id),'block', displayValueLock, setDvLock);
        if(clicked[ids.indexOf(e.target.id)]) {
            handleArrayUpdate(ids.indexOf(e.target.id),'block', displayValueUnlock, setDvUnlock);
            handleArrayUpdate(ids.indexOf(e.target.id),'none', displayValueLock, setDvLock);
        }
    };

    // handling mouseleave - hiding the correct lock/unlock
    const handleMouseLeave = (e) => {

        if(!clicked[ids.indexOf(e.target.id)]) handleArrayUpdate(ids.indexOf(e.target.id),'none', displayValueLock, setDvLock);
        if(clicked[ids.indexOf(e.target.id)]) {
            handleArrayUpdate(ids.indexOf(e.target.id),'block', displayValueLock, setDvLock);
            handleArrayUpdate(ids.indexOf(e.target.id),'none', displayValueUnlock, setDvUnlock);
        }
        onHover(null);
        // console.log('left: '+e.target.id)

    }

    //handling mouse click - hiding all other locks, setting clicked values etc.
    const handleMouseClick = (e) => {
        lockedValueSetter(e.target.id)
        handleArrayUpdate(ids.indexOf(e.target.id), !clicked[ids.indexOf(e.target.id)], clicked, setClicked, true);
        if(!clicked[ids.indexOf(e.target.id)]){
            handleArrayUpdate(ids.indexOf(e.target.id),'none', displayValueLock, setDvLock, true);
            handleArrayUpdate(ids.indexOf(e.target.id),'block', displayValueUnlock, setDvUnlock, true);
        }
        if(clicked[ids.indexOf(e.target.id)]){
            handleArrayUpdate(ids.indexOf(e.target.id),'none', displayValueUnlock, setDvUnlock, true);
        }
    };
    let height = window.innerHeight*0.04;
    if(maxHeight < height) height = maxHeight;
    return (
        <div id={id} className="divScale">
            <svg viewBox={"0 0 "+totalWidth+" "+ height} className="svgScale" >
            <rect id={ids[0]} onMouseOver={handleMouseEnter} onMouseLeave={handleMouseLeave} onClick={handleMouseClick} width={totalWidth/5} height={height} x={0}  className="level1"></rect><Lock displayValue={displayValueLock[0]} x={totalWidth/5/2-9} y={height/5} fill="#000"/><Unlock displayValue={displayValueUnlock[0]} x={totalWidth/5/2-9} y={height/5} fill="#000"/>
                <rect id={ids[1]} onMouseOver={handleMouseEnter} onMouseLeave={handleMouseLeave} onClick={handleMouseClick} width={totalWidth/5} height={height} x={totalWidth/5} className="level2"></rect><Lock displayValue={displayValueLock[1]} x={3*totalWidth/5/2-9} y={height/5} fill="#000"/><Unlock displayValue={displayValueUnlock[1]} x={3*totalWidth/5/2-9} y={height/5} fill="#000"/>
                <rect id={ids[2]} onMouseOver={handleMouseEnter} onMouseLeave={handleMouseLeave} onClick={handleMouseClick} width={totalWidth/5} height={height} x={2*totalWidth/5}  className="level3"></rect><Lock displayValue={displayValueLock[2]} x={5*totalWidth/5/2-9} y={height/5} fill="#fff"/><Unlock displayValue={displayValueUnlock[2]} x={5*totalWidth/5/2-9} y={height/5} fill="#fff"/>
                <rect id={ids[3]} onMouseOver={handleMouseEnter} onMouseLeave={handleMouseLeave} onClick={handleMouseClick} width={totalWidth/5} height={height} x={3*totalWidth/5}  className="level4"></rect><Lock displayValue={displayValueLock[3]} x={7*totalWidth/5/2-9} y={height/5} fill="#fff"/><Unlock displayValue={displayValueUnlock[3]} x={7*totalWidth/5/2-9} y={height/5} fill="#fff"/>
                <rect id={ids[4]} onMouseOver={handleMouseEnter} onMouseLeave={handleMouseLeave} onClick={handleMouseClick} width={totalWidth/5} height={height} x={4*totalWidth/5}  className="level5"></rect><Lock displayValue={displayValueLock[4]} x={9*totalWidth/5/2-9} y={height/5} fill="#fff"/><Unlock displayValue={displayValueUnlock[4]} x={9*totalWidth/5/2-9} y={height/5} fill="#fff"/>
            </svg>
            <div className="scaleLabels">
                <span className="scaleLabelChildFive">{labels[0]}</span>
                <span className="scaleLabelChildFive">{labels[1]}</span>
                <span className="scaleLabelChildFive">{labels[2]}</span>
                <span className="scaleLabelChildFive">{labels[3]}</span>
                <span className="scaleLabelChildFive">{labels[4]}</span>
            </div>
            <div className="scaleTitle">
                <span >
                    {scaleTitle}
                </span>
            </div>


        </div>
    )
}

export function KPScale({totalWidth, maxHeight, labels, scaleTitle, id, ids, onHover, lockedValueSetter}) {
    const [displayValueLock, setDvLock] = useState(['none', 'none', 'none', 'none', 'none', 'none']);
    const [displayValueUnlock, setDvUnlock] = useState(['none', 'none', 'none', 'none', 'none', 'none']);
    const [clicked, setClicked] = useState([false, false, false, false, false, false]);

    //// HANDLING LOCKS
    //function that updates any array from the three arrays above - if clicked, it will reset all values before doing anything
    const handleArrayUpdate = (index, value, array, arraySetter, clicked) => {
        const newArray = [...array];
        if(clicked){
            for(let i = 0; i <= 5; i++){
                if(value === false || value === true) newArray[i] = false;
                if(value === 'block' || value === 'none') newArray[i] = 'none';
            }
        }

        newArray[index] = value;
        arraySetter(newArray);
    }

    // handling hover - displaying the correct lock/unlock
    const handleMouseEnter = (e) => {
        onHover(e.target.id);
        if(!clicked[ids.indexOf(e.target.id)]) handleArrayUpdate(ids.indexOf(e.target.id),'block', displayValueLock, setDvLock);
        if(clicked[ids.indexOf(e.target.id)]) {
            handleArrayUpdate(ids.indexOf(e.target.id),'block', displayValueUnlock, setDvUnlock);
            handleArrayUpdate(ids.indexOf(e.target.id),'none', displayValueLock, setDvLock);
        }
    };

    // handling mouseleave - hiding the correct lock/unlock
    const handleMouseLeave = (e) => {

        if(!clicked[ids.indexOf(e.target.id)]) handleArrayUpdate(ids.indexOf(e.target.id),'none', displayValueLock, setDvLock);
        if(clicked[ids.indexOf(e.target.id)]) {
            handleArrayUpdate(ids.indexOf(e.target.id),'block', displayValueLock, setDvLock);
            handleArrayUpdate(ids.indexOf(e.target.id),'none', displayValueUnlock, setDvUnlock);
        }
        onHover(null);
        // console.log('left: '+e.target.id)

    }

    //handling mouse click - hiding all other locks, setting clicked values etc.
    const handleMouseClick = (e) => {
        lockedValueSetter(e.target.id)
        handleArrayUpdate(ids.indexOf(e.target.id), !clicked[ids.indexOf(e.target.id)], clicked, setClicked, true);
        if(!clicked[ids.indexOf(e.target.id)]){
            handleArrayUpdate(ids.indexOf(e.target.id),'none', displayValueLock, setDvLock, true);
            handleArrayUpdate(ids.indexOf(e.target.id),'block', displayValueUnlock, setDvUnlock, true);
        }
        if(clicked[ids.indexOf(e.target.id)]){
            handleArrayUpdate(ids.indexOf(e.target.id),'none', displayValueUnlock, setDvUnlock, true);
        }
    };

    let height = window.innerHeight*0.04;
    if(maxHeight < height) height = maxHeight;
    return (
        <div id={id} className="divScale">
            <svg viewBox={"0 0 "+totalWidth+" "+height} className="svgScale" >
                <rect id={ids[0]} onMouseOver={handleMouseEnter} onMouseLeave={handleMouseLeave} onClick={handleMouseClick} width={totalWidth/6} x={0} height={height} className="kpScale1"></rect><Lock displayValue={displayValueLock[0]} x={totalWidth/6/2-9} y={height/5} fill="#fff"/><Unlock displayValue={displayValueUnlock[0]} x={totalWidth/6/2-9} y={height/5} fill="#fff"/>
                <rect id={ids[1]} onMouseOver={handleMouseEnter} onMouseLeave={handleMouseLeave} onClick={handleMouseClick} width={totalWidth/6} x={totalWidth/6} height={height} className="kpScale2"></rect><Lock displayValue={displayValueLock[1]} x={3*totalWidth/6/2-9} y={height/5} fill="#fff"/><Unlock displayValue={displayValueUnlock[1]} x={3*totalWidth/6/2-9} y={height/5} fill="#fff"/>
                <rect id={ids[2]} onMouseOver={handleMouseEnter} onMouseLeave={handleMouseLeave} onClick={handleMouseClick} width={totalWidth/6} x={2*totalWidth/6} height={height} className="kpScale3"></rect><Lock displayValue={displayValueLock[2]} x={5*totalWidth/6/2-9} y={height/5} fill="#000"/><Unlock displayValue={displayValueUnlock[2]} x={5*totalWidth/6/2-9} y={height/5} fill="#000"/>
                <rect id={ids[3]} onMouseOver={handleMouseEnter} onMouseLeave={handleMouseLeave} onClick={handleMouseClick} width={totalWidth/6} x={3*totalWidth/6} height={height} className="kpScale4"></rect><Lock displayValue={displayValueLock[3]} x={7*totalWidth/6/2-9} y={height/5} fill="#000"/><Unlock displayValue={displayValueUnlock[3]} x={7*totalWidth/6/2-9} y={height/5} fill="#000"/>
                <rect id={ids[4]} onMouseOver={handleMouseEnter} onMouseLeave={handleMouseLeave} onClick={handleMouseClick} width={totalWidth/6} x={4*totalWidth/6} height={height} className="kpScale5"></rect><Lock displayValue={displayValueLock[4]} x={9*totalWidth/6/2-9} y={height/5} fill="#fff"/><Unlock displayValue={displayValueUnlock[4]} x={9*totalWidth/6/2-9} y={height/5} fill="#fff"/>
                <rect id={ids[5]} onMouseOver={handleMouseEnter} onMouseLeave={handleMouseLeave} onClick={handleMouseClick} width={totalWidth/6} x={5*totalWidth/6} height={height} className="kpScale6"></rect><Lock displayValue={displayValueLock[5]} x={11*totalWidth/6/2-9} y={height/5} fill="#fff"/><Unlock displayValue={displayValueUnlock[5]} x={11*totalWidth/6/2-9} y={height/5} fill="#fff"/>
            </svg>
            <div className="scaleLabels">
                <span className="scaleLabelChildSix">{labels[0]}</span>
                <span className="scaleLabelChildSix">{labels[1]}</span>
                <span className="scaleLabelChildSix">{labels[2]}</span>
                <span className="scaleLabelChildSix">{labels[3]}</span>
                <span className="scaleLabelChildSix">{labels[4]}</span>
                <span className="scaleLabelChildSix">{labels[5]}</span>
            </div>
            <div className="scaleTitle">
                <span >
                    {scaleTitle}
                </span>
            </div>


        </div>
    )
}

export function CloudScale({totalWidth, maxHeight, labels, scaleTitle, id, ids, onHover, lockedValueSetter}) {
    const [displayValueLock, setDvLock] = useState(['none', 'none', 'none', 'none', 'none']);
    const [displayValueUnlock, setDvUnlock] = useState(['none', 'none', 'none', 'none', 'none']);
    const [clicked, setClicked] = useState([false, false, false, false, false]);

    //// HANDLING LOCKS
    //function that updates any array from the three arrays above - if clicked, it will reset all values before doing anything
    const handleArrayUpdate = (index, value, array, arraySetter, clicked) => {
        const newArray = [...array];
        if(clicked){
            for(let i = 0; i <= 4; i++){
                if(value === false || value === true) newArray[i] = false;
                if(value === 'block' || value === 'none') newArray[i] = 'none';
            }
        }

        newArray[index] = value;
        arraySetter(newArray);
    }

    // handling hover - displaying the correct lock/unlock
    const handleMouseEnter = (e) => {
        onHover(e.target.id);
        if(!clicked[ids.indexOf(e.target.id)]) handleArrayUpdate(ids.indexOf(e.target.id),'block', displayValueLock, setDvLock);
        if(clicked[ids.indexOf(e.target.id)]) {
            handleArrayUpdate(ids.indexOf(e.target.id),'block', displayValueUnlock, setDvUnlock);
            handleArrayUpdate(ids.indexOf(e.target.id),'none', displayValueLock, setDvLock);
        }
    };

    // handling mouseleave - hiding the correct lock/unlock
    const handleMouseLeave = (e) => {

        if(!clicked[ids.indexOf(e.target.id)]) handleArrayUpdate(ids.indexOf(e.target.id),'none', displayValueLock, setDvLock);
        if(clicked[ids.indexOf(e.target.id)]) {
            handleArrayUpdate(ids.indexOf(e.target.id),'block', displayValueLock, setDvLock);
            handleArrayUpdate(ids.indexOf(e.target.id),'none', displayValueUnlock, setDvUnlock);
        }
        onHover(null);
        // console.log('left: '+e.target.id)

    }

    //handling mouse click - hiding all other locks, setting clicked values etc.
    const handleMouseClick = (e) => {
        lockedValueSetter(e.target.id)
        handleArrayUpdate(ids.indexOf(e.target.id), !clicked[ids.indexOf(e.target.id)], clicked, setClicked, true);
        if(!clicked[ids.indexOf(e.target.id)]){
            handleArrayUpdate(ids.indexOf(e.target.id),'none', displayValueLock, setDvLock, true);
            handleArrayUpdate(ids.indexOf(e.target.id),'block', displayValueUnlock, setDvUnlock, true);
        }
        if(clicked[ids.indexOf(e.target.id)]){
            handleArrayUpdate(ids.indexOf(e.target.id),'none', displayValueUnlock, setDvUnlock, true);
        }
    };

    let height = window.innerHeight*0.04;
    if(maxHeight < height) height = maxHeight;
    return (
        <div id={id} className="divScale">
            <svg viewBox={"0 0 "+totalWidth+" "+height} className="svgScale" >
                <rect id={ids[0]} onMouseOver={handleMouseEnter} onMouseLeave={handleMouseLeave} onClick={handleMouseClick} width={totalWidth/5} x={0} height={height} className="cloudScale1"></rect><Lock displayValue={displayValueLock[0]} x={totalWidth/5/2-9} y={height/5} fill="#fff"/><Unlock displayValue={displayValueUnlock[0]} x={totalWidth/5/2-9} y={height/5} fill="#fff"/>
                <rect id={ids[1]} onMouseOver={handleMouseEnter} onMouseLeave={handleMouseLeave} onClick={handleMouseClick} width={totalWidth/5} x={totalWidth/5} height={height} className="cloudScale2"></rect><Lock displayValue={displayValueLock[1]} x={3*totalWidth/5/2-9} y={height/5} fill="#fff"/><Unlock displayValue={displayValueUnlock[1]} x={3*totalWidth/5/2-9} y={height/5} fill="#fff"/>
                <rect id={ids[2]} onMouseOver={handleMouseEnter} onMouseLeave={handleMouseLeave} onClick={handleMouseClick} width={totalWidth/5} x={2*totalWidth/5} height={height} className="cloudScale3"></rect><Lock displayValue={displayValueLock[2]} x={5*totalWidth/5/2-9} y={height/5} fill="#fff"/><Unlock displayValue={displayValueUnlock[2]} x={5*totalWidth/5/2-9} y={height/5} fill="#fff"/>
                <rect id={ids[3]} onMouseOver={handleMouseEnter} onMouseLeave={handleMouseLeave} onClick={handleMouseClick} width={totalWidth/5} x={3*totalWidth/5} height={height} className="cloudScale4"></rect><Lock displayValue={displayValueLock[3]} x={7*totalWidth/5/2-9} y={height/5} fill="#000000"/><Unlock displayValue={displayValueUnlock[3]} x={7*totalWidth/5/2-9} y={height/5} fill="#000"/>
                <rect id={ids[4]} onMouseOver={handleMouseEnter} onMouseLeave={handleMouseLeave} onClick={handleMouseClick} width={totalWidth/5} x={4*totalWidth/5} height={height} className="cloudScale5"></rect><Lock displayValue={displayValueLock[4]} x={9*totalWidth/5/2-9} y={height/5} fill="#000000"/><Unlock displayValue={displayValueUnlock[4]} x={9*totalWidth/5/2-9} y={height/5} fill="#000"/>
            </svg>
            <div className="scaleLabels">
                <span className="scaleLabelChildFive">{labels[0]}</span>
                <span className="scaleLabelChildFive">{labels[1]}</span>
                <span className="scaleLabelChildFive">{labels[2]}</span>
                <span className="scaleLabelChildFive">{labels[3]}</span>
                <span className="scaleLabelChildFive">{labels[4]}</span>
            </div>
            <div className="scaleTitle">
                <span >
                    {scaleTitle}
                </span>
            </div>


        </div>
    )
}
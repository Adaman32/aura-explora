export function AuroraScale({totalWidth, maxHeight, labels, scaleTitle, id, ids, onHover}) {
    const handleMouseEnter = (e) => onHover(e.target.id);
    const handleMouseLeave = () => onHover(null);
    let height = window.innerHeight*0.04;
    if(maxHeight < height) height = maxHeight;
    return (
        <div id={id} className="divScale">
            <svg viewBox={"0 0 "+totalWidth+" "+ height} className="svgScale" >
                <rect id={ids[0]} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} width={totalWidth/5} height={height} x={0}  className="level1 scaleRect"></rect>
                <rect id={ids[1]} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} width={totalWidth/5} height={height} x={totalWidth/5} className="level2 scaleRect"></rect>
                <rect id={ids[2]} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} width={totalWidth/5} height={height} x={2*totalWidth/5}  className="level3 scaleRect"></rect>
                <rect id={ids[3]} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} width={totalWidth/5} height={height} x={3*totalWidth/5}  className="level4 scaleRect"></rect>
                <rect id={ids[4]} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} width={totalWidth/5} height={height} x={4*totalWidth/5}  className="level5 scaleRect"></rect>
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

export function KPScale({totalWidth, maxHeight, labels, scaleTitle, id, ids, onHover}) {
    const handleMouseEnter = (e) => onHover(e.target.id);
    const handleMouseLeave = () => onHover(null);
    let height = window.innerHeight*0.04;
    if(maxHeight < height) height = maxHeight;
    return (
        <div id={id} className="divScale">
            <svg viewBox={"0 0 "+totalWidth+" "+height} className="svgScale" >
                <rect id={ids[0]} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} width={totalWidth/6} x={0} height={height} className="level0 scaleRect"></rect>
                <rect id={ids[1]} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} width={totalWidth/6} x={totalWidth/6} height={height} className="level1 scaleRect"></rect>
                <rect id={ids[2]} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} width={totalWidth/6} x={2*totalWidth/6} height={height} className="level2 scaleRect"></rect>
                <rect id={ids[3]} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} width={totalWidth/6} x={3*totalWidth/6} height={height} className="level3 scaleRect"></rect>
                <rect id={ids[4]} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} width={totalWidth/6} x={4*totalWidth/6} height={height} className="level4 scaleRect"></rect>
                <rect id={ids[5]} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} width={totalWidth/6} x={5*totalWidth/6} height={height} className="level5 scaleRect"></rect>
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

export function CloudScale({totalWidth, maxHeight, labels, scaleTitle, id, ids, onHover}) {
    const handleMouseEnter = (e) => onHover(e.target.id);
    const handleMouseLeave = () => onHover(null);
    let height = window.innerHeight*0.04;
    if(maxHeight < height) height = maxHeight;
    return (
        <div id={id} className="divScale">
            <svg viewBox={"0 0 "+totalWidth+" "+height} className="svgScale" >
                <rect id={ids[0]} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} width={totalWidth/5} x={0} height={height} className="cloudScale1"></rect>
                <rect id={ids[1]} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} width={totalWidth/5} x={totalWidth/5} height={height} className="cloudScale2"></rect>
                <rect id={ids[2]} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} width={totalWidth/5} x={2*totalWidth/5} height={height} className="cloudScale3"></rect>
                <rect id={ids[3]} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} width={totalWidth/5} x={3*totalWidth/5} height={height} className="cloudScale4"></rect>
                <rect id={ids[4]} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} width={totalWidth/5} x={4*totalWidth/5} height={height} className="cloudScale5"></rect>
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
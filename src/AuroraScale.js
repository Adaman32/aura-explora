export function AuroraScale({totalWidth, totalHeight, labels, scaleTitle}) {
    return (
        <div className="divScale">
            <svg viewBox={"0 0 "+totalWidth+" "+totalHeight} className="svgScale" >
                <rect width={totalWidth/5} x={0} height={totalHeight} className="level1 scaleRect"></rect>
                <rect width={totalWidth/5} x={totalWidth/5} height={totalHeight} className="level2 scaleRect"></rect>
                <rect width={totalWidth/5} x={2*totalWidth/5} height={totalHeight} className="level3 scaleRect"></rect>
                <rect width={totalWidth/5} x={3*totalWidth/5} height={totalHeight} className="level4 scaleRect"></rect>
                <rect width={totalWidth/5} x={4*totalWidth/5} height={totalHeight} className="level5 scaleRect"></rect>
            </svg>
            <div className="scaleLabels">
                <span className="scaleLabelChild">{labels[0]}</span>
                <span className="scaleLabelChild">{labels[1]}</span>
                <span className="scaleLabelChild">{labels[2]}</span>
                <span className="scaleLabelChild">{labels[3]}</span>
                <span className="scaleLabelChild">{labels[4]}</span>
            </div>
            <div className="scaleTitle">
                <span >
                    {scaleTitle}
                </span>
            </div>


        </div>
    )
}

export function CloudScale({totalWidth, totalHeight, labels, scaleTitle}) {
    return (
        <div className="divScale">
            <svg viewBox={"0 0 "+totalWidth+" "+totalHeight} className="svgScale" >
                <rect width={totalWidth/5} x={0} height={totalHeight} className="clevel1 scaleRect"></rect>
                <rect width={totalWidth/5} x={totalWidth/5} height={totalHeight} className="clevel2 scaleRect"></rect>
                <rect width={totalWidth/5} x={2*totalWidth/5} height={totalHeight} className="clevel3 scaleRect"></rect>
                <rect width={totalWidth/5} x={3*totalWidth/5} height={totalHeight} className="clevel4 scaleRect"></rect>
                <rect width={totalWidth/5} x={4*totalWidth/5} height={totalHeight} className="clevel5 scaleRect"></rect>
            </svg>
            <div className="scaleLabels">
                <span className="scaleLabelChild">{labels[0]}</span>
                <span className="scaleLabelChild">{labels[1]}</span>
                <span className="scaleLabelChild">{labels[2]}</span>
                <span className="scaleLabelChild">{labels[3]}</span>
                <span className="scaleLabelChild">{labels[4]}</span>
            </div>
            <div className="scaleTitle">
                <span >
                    {scaleTitle}
                </span>
            </div>


        </div>
    )
}
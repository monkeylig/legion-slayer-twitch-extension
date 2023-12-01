import meterBarStyles from "./meter-bar.module.css"
import colors from "@/utilities/colors";

export default function MeterBar({progress=0, barColor=colors.green, className='', style={}, children}) {
    return (
        <div className={`${meterBarStyles['meter-bar']} ${className}`} style={style}>
            <div className={meterBarStyles['meter-bar-empty']}>
                <div className={meterBarStyles['bar-label']}>{children}</div>
                {progress > 0 && <div style={{background: barColor, width: `${progress*100}%`}} className={meterBarStyles['meter-bar-fill']}></div>}
            </div>
        </div>
    );
}
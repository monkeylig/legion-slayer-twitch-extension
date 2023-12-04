import MeterBar from "./meter-bar";
import meterBarStyles from "./meter-bar.module.css"

export default function LabeledMeterBar({progress, barColor, bottomLabel, className='', children}) {
    return (
        <div className={`${meterBarStyles['labeled-bar']} ${className}`}>
            <MeterBar barColor={barColor} progress={progress}/>
            <div className={meterBarStyles['label-container']}>
                <span>{children}</span>
                {bottomLabel}
            </div>
        </div>
    );
}
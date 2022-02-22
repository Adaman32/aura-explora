
function Checkbox({id,onClickEvent, isChecked, labelText })  {
    // const [isChecked, setIsChecked] = useState(false);

   return  (
    <label onClick={onClickEvent}>
        <input 
            type="checkbox" 
            name="stations" 
            id={id}
            // onClick={() => setVisibleA(!visibleA)} 
            // defaultChecked={checked}
            // onChange={() => setIsChecked(!isChecked)} 
            />
        <svg className="checkboxSvg" aria-hidden="true" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect fill="white" className={`checkbox ${isChecked ? "checkbox--active" : ""}`} x="3" y="3" width="14" height="14" rx="3" />
        <rect x="0.5" y="0.5" width="19" height="19" rx="5.5" stroke="white"/>
        </svg>
        
        <label className="checkboxLabels" htmlFor="auroraCheckbox">{labelText}</label>
    </label>

   )

}

export default Checkbox;
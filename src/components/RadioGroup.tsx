const Radio: React.FC<{
    value: string,
    checked: boolean,
    onClick: (value: string) => void
}> = ({ value, checked, onClick }) => {
    return (
        <div className="flex items-center">
            <button className={`${checked ? "border-secondary1" : "border-gray-200"} rounded-xl border-2 px-6 py-2`} onClick={() => onClick(value)}>
                {/* {checked && <div className="bg-blue-500 w-4 h-4 rounded-full" />} */}
                {value}
            </button>
        </div>
    );
}

export const RadioGroup: React.FC<{
    name: string,
    values: string[],
    selected: string,
    onChange: (name: string) => void
}> = ({ name, values, selected, onChange }) => {
    return (
        <div className="flex flex-row gap-5 m-6">
            {values.map((value) => (
                <Radio value={value} checked={value === selected} onClick={onChange} key={value} />
            ))}
        </div>
    );
};
import './Switch.scss';

export const Switch = ({ label, onChange }) => {
	return (
		<label className='switch' htmlFor='switch'>
			<span className='switchLabel'>{label}</span>
			<input type='checkbox' id='switch' role='switch' onChange={onChange} />
			<span className='state'>
				<span className='container'>
					<span className='position'></span>
				</span>
			</span>
		</label>
	);
};
export default Switch;

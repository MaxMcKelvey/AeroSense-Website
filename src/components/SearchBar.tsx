import { useState } from 'react';
import { MagnifyingGlassIcon, ArrowRightIcon } from '@heroicons/react/24/outline'

// function SearchBar() {
const SearchBar: React.FC<{ title: string }> = ({ title }) => {
	const [searchQuery, setSearchQuery] = useState('');

	const handleSubmit = (event: { preventDefault: () => void }) => {
		event.preventDefault();
		// TODO: handle search query submission
	};

	const handleChange = (event: { target: { value: string } }) => {
		setSearchQuery(event.target.value);
	};

	return (
		<div className="flex flex-col">
			<span className="text-lg px-1 italic font-extralight">{title}</span>
			<form onSubmit={handleSubmit} className="relative flex items-center">
				<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
					<MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
				</div>
				<input
					type="text"
					value={searchQuery}
					onChange={handleChange}
					placeholder="Search"
					className="border-2 border-gray-300 bg-white h-10 pl-10 rounded-lg text-sm focus:outline-none" // pr-10
				/>
				<button type="submit" className="absolute right-1 bottom-1 text-gray-400 hover:text-white font-bold px-2 rounded-md h-8 hover:bg-secondary1">
					<ArrowRightIcon className="h-5 w-5" aria-hidden="true" />
				</button>
			</form>
		</div>
	);
}

export default SearchBar;
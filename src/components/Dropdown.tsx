import React, { useEffect, useRef, useState } from "react";

const DropdownMenu: React.FC<{ title: string, menuItems: { label: string, onClick: () => void }[], dropdownName: string }> = ({ title, menuItems, dropdownName }) => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const ref = useRef<HTMLDivElement>(null);

	const handleMenuToggle = () => {
		setIsMenuOpen(!isMenuOpen);
	};

	const handleMenuItemClick = (menuItem: {onClick: () => void}) => {
		menuItem.onClick();
		setIsMenuOpen(false);
	};

	useEffect(() => {
		document.addEventListener("keydown", escFunction, false);
		document.addEventListener('mousedown', clickOutside);
		return function cleanup() {
			document.removeEventListener("keydown", escFunction, false);
			document.removeEventListener('mousedown', clickOutside);
		};
	})

	const escFunction = (event: {key: string}) => {
		if (event.key === "Escape") {
			setIsMenuOpen(false);
		}
	}

	const clickOutside = (event: MouseEvent) => {
		const cur: HTMLDivElement | null = ref.current
        const node = event.target as Node
        if (cur && cur.contains(node)) return;
        setIsMenuOpen(false);
	}

	return (
		<div className="flex flex-col">
			<span className="text-lg px-1 italic font-extralight">{title}</span>
			<div className="relative" ref={ref}>
				<button
					// className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
					className="bg-secondary2 hover:bg-secondary1 text-white font-bold py-2 px-4 rounded w-48"
					onClick={handleMenuToggle}
				>
					{dropdownName}
				</button>
				{isMenuOpen && (
					<div className="absolute z-10 mt-2 py-2 w-48 bg-white rounded-lg shadow-md">
						{menuItems.map((item) => (
							<button
								key={item.label}
								// className="block px-4 py-2 text-gray-800 hover:bg-indigo-500 hover:text-white w-full"
								className="block px-4 py-2 text-gray-800 hover:bg-neutral2 w-full"
								onClick={() => handleMenuItemClick(item)}
							>
								{item.label}
							</button>
						))}
					</div>
				)}
			</div>
		</div>
	);
};

export default DropdownMenu;

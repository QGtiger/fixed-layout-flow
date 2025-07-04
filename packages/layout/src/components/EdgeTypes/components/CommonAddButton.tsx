export default function CommonAddButton({
  onClick,
  label,
}: {
  onClick(): void;
  label?: string;
}) {
  return (
    <div
      className="cursor-pointer text-xs bg-white border border-solid border-gray-300
  text-gray-400 
  px-1
    rounded-sm flex items-center justify-center
    hover:bg-gray-50 hover:border-blue-400 hover:text-blue-500
    transition-all duration-200 shadow-sm
    transform hover:scale-110"
      onClick={onClick}
    >
      <span className=" font-medium -mt-0.5">+</span>
      {label}
    </div>
  );
}

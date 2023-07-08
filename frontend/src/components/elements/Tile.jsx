export default function Tile({ children }) {
  return (
    <div className="flex flex-col m-auto justify-between w-[93vw] p-8 bg-white rounded-xl shadow-lg shadow-slate-500/50 border-solid border-2 border-slate-300 clip">
      {children}
    </div>
  );
}

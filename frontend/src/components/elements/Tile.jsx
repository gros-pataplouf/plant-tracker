export default function Tile({ children }) {
  return (
    <div className="flex flex-col m-auto justify-between w-[93vw] md:w-min-2/4 md:w-2/4 p-8 md:p-24 lg:p-12 bg-white rounded-xl shadow-lg shadow-slate-500/50 border-solid border-2 border-slate-300 clip">
      {children}
    </div>
  );
}

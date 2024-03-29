//The same as Tile, but with relative positioning
export default function TileXL({ children }) {
  return (
    <div className="flex flex-col relative mx-auto my-4 lg:mt-16 justify-between w-[95vw] lg:max-w-5xl p-2 md:w-min-2/4 lg:p-2 md:w-3/4 md:p-16 bottom-0  bg-white rounded-xl shadow-lg shadow-slate-500/50 border-solid border-2 border-slate-300 clip">
      {children}
    </div>
  );
}

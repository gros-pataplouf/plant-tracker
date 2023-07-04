//The same as Tile, but with relative positioning 


const classes = {
  wrapper:
    "flex flex-col relative m-auto justify-between w-[95vw] bottom-0 p-2 bg-white rounded-xl shadow-lg shadow-slate-500/50 border-solid border-2 border-slate-300 clip",
};

export default function TileXL({ children }) {
  return <div className={classes.wrapper}>{children}</div>;
}

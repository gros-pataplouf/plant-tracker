const classes = {
  wrapper:
    "flex flex-col m-auto justify-between w-[85vw] p-8 bg-white rounded-xl shadow-lg shadow-slate-500/50 border-solid border-2 border-slate-300",
};

export default function Tile({ children }) {
  return <div className={classes.wrapper}>{children}</div>;
}

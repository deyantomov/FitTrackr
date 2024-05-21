export default function SidebarButton({icon, text}) {
  return (
    <button className="btn btn-block shadow-none text-2xl flex justify-start m-0">
      {icon}
      {text}
    </button>
  );
}

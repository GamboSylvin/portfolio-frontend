

 function MenuIcon({ className = "" }){
    return (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    {/* Top bar */}
    <path
      d="M3 6H21"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />

    {/* Middle bar — shorter */}
    <path
      d="M3 12H15"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />

    {/* Bottom bar */}
    <path
      d="M3 18H21"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
)};

export default MenuIcon;
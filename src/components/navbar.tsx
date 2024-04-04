export default function Navbar() {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <div className="text-white font-bold">Logo</div>
          <ul className="flex">
            <li className="mr-6">
              <a className="text-white hover:text-gray-300" href="#">Home</a>
            </li>
            <li className="mr-6">
              <a className="text-white hover:text-gray-300" href="#">About</a>
            </li>
            <li className="mr-6">
              <a className="text-white hover:text-gray-300" href="#">Services</a>
            </li>
            <li>
              <a className="text-white hover:text-gray-300" href="#">Contact</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};
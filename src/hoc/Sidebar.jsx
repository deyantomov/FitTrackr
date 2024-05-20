import { useState } from 'react';
import Navbar from '../components/Navbar/Navbar';
import { Link } from 'react-router-dom';

/**
 * 
 * @param {{children: JSX.Element | Array<JSX.Element>}} props 
 */
export default function Sidebar({children}) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="drawer w-full h-screen">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col items-start justify-center p-0">
      <Navbar toggleDrawer={toggleSidebar} />
        <div className='flex flex-col w-full h-full text-4xl'>
          {/* content here */}
          {children}
        </div>
      </div> 
      <div className="drawer-side">
        <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label> 
        <div className="menu p-4 w-80 min-h-screen bg-base-200 text-base-content">
          <Link to='/'>
            <h2 className="text-3xl mt-3 mb-6">FitTrackr</h2>
          </Link>
        </div>
      </div>
    </div>
  );
}
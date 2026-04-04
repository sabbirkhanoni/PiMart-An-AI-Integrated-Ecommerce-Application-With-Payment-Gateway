import { Outlet } from "react-router-dom"
import UserMenu from "../components/UserMenu.jsx";




const Dashboard = () => {

  return (
    <section className = 'bg-white'>
      <div className = 'container mx-auto p-3 grid lg:grid-cols-[_250px_1fr]'>
        {/* left for menu */}
        <div className = 'py-4 sticky top-30 max-h-[calc(100vh-96px)] overflow-auto hidden lg:block border-r border-gray-300'>
          <UserMenu/>
        </div>

        {/* right for content */}
        <div className="bg-white min-h-[75vh]"> 
          <Outlet/>
        </div>

      </div>
    </section>
  )
}

export default Dashboard
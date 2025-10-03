import UserMenu from "../../components/userMenu"
import { IoCloseCircleSharp } from "react-icons/io5";

const UserMenuPage = () => {
  return (
    <section className="bg-white h-full w-full py-4">
      <button className="text-neutral-950 block w-fit ml-auto px-5" onClick={()=>window.history.back()}>
        <IoCloseCircleSharp size={25} />
      </button>
      <div className="container mx-auto px-2 py-4">
        <UserMenu/>
      </div>
    </section>
  )
}

export default UserMenuPage
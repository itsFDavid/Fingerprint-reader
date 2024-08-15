import { Link } from "react-router-dom"


export const Aside = ({name})=>{

    return(
        <aside className="w-64 bg-white shadow-md">
        <div className="p-6">
          <h1 className="text-xl font-semibold">{name}</h1>
        </div>
        <nav className="mt-6">
          <ul>
            <li className="mt-2">
              <Link
                to="/"
                className="block py-2 px-4 rounded hover:bg-blue-200"
              >
                Dashboard
              </Link>
            </li>
            <li className="mt-2">
              <Link
                to="/actions"
                className="block py-2 px-4 rounded hover:bg-blue-200"
              >
                Actions
              </Link>
            </li>
            <li className="mt-2">
              <Link 
              to="/custom"
              className="block py-2 px-4 rounded hover:bg-blue-200"
              >
                Custom
              </Link>
            </li>
          </ul>
        </nav>
      </aside>
    )
}
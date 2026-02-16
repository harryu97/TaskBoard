import { Link } from "react-router"
import { useEffect, useState } from "react"
import { ArrowLeft } from "lucide-react"
const NavBar = () => {
  return (
    <header className="bg-base-300 border-b border-base-content/10">
      <div className="mx-auto max-w-6xl p-4">

        <div className="absolute left-10">
          <Link
            to="/dashboard"
            className="btn btn-ghost btn-sm btn-square text-primary border border-primary/20 hover:bg-primary/10"
          >
            <ArrowLeft size={20} />
          </Link>
        </div>
        <div className="flex items-center gap-3">

          <h1 className="text-3xl font-bold text-primary font-mono tracking_tighter">
            ThinkBoard
          </h1>

        </div>
      </div>
    </header>
  )
}

export default NavBar

import { Link } from "react-router-dom"
export default function Header () {
  return (
    <div>
      <nav>
          <ul>
              <li><Link to={'/'}>Plant Info</Link></li>
              <li><Link to={'explore/'}>Explore</Link></li>
              <li><Link to={'track/'}>Participate</Link></li>
              <li><Link to={'about/'}>About</Link></li>
          </ul>
      </nav>
    </div>
  )
}
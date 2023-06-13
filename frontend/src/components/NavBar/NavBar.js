import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/session';
import './NavBar.css';

function NavBar () {
  const loggedIn = useSelector(state => !!state.session.user);
  const dispatch = useDispatch();
  
  const logoutUser = e => {
      e.preventDefault();
      dispatch(logout());
  }

  const getLinks = () => {
    if (loggedIn) {
      return (
        <ul className="links-nav nav-links">
          <li><Link to={'/feedPosts'}>All FeedPosts</Link></li>
          <li><Link to={'/profile'}>Profile</Link></li>
          <li><Link to={'/feedPosts/newGoal'}>Create a new goal</Link></li>
          {/* <button onClick={logoutUser}>Logout</button> */}
          <li><div onClick={logoutUser}>Logout</div></li>
        </ul>
      );
    } else {
      return (
        <ul className="links-auth nav-links">
          <li><Link to={'/signup'}>Signup</Link></li>
          <li><Link to={'/login'}>Login</Link></li>
        </ul>
      );
    }
  }

  return (
    <div className='nav-bar-container'>
      <h1>FitOn</h1>
      <div className='nav-bar-divider'></div>
			<div className='links-menu'>
      	{ getLinks() }

			</div>
    </div>
  );
}

export default NavBar;
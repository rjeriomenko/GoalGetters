import "./FollowNavBar.css";
import { useSelector } from "react-redux";
import { NavLink, Link } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";

const FollowNavBar = ({goalsOnly, setGoalsOnly, workoutsOnly, setWorkoutsOnly}) => {
	const sessionUser = useSelector(state => state.session.user);
	const randomNum = () => Math.random();
	const [scrolledFeed, setScrolledFeed] = useState(false);

	const handleScroll = (e) => {
		const distanceScrolled = document.documentElement.scrollTop;
		const followNavBar = document.querySelector(".follow-nav-bar-container")
		if(distanceScrolled > 450) {
			setScrolledFeed(true)
			// followNavBar.style.classList.add("scrolled-follow-nav-bar")
		} else {
			setScrolledFeed(false)
			// followNavBar.style.classList.remove("scrolled-follow-nav-bar")
		}
	}

	const resetMarker = (e) => {
		const marker = document.querySelector(".hover-marker")
		const topLink = document.querySelector(".feed-nav-top-link").querySelector("a")
		const midLink = document.querySelector(".feed-nav-mid-link").querySelector("a")
		const botLink = document.querySelector(".feed-nav-bot-link").querySelector("a")
		
		let link;
		const topEdgeY = document.querySelector(".feed-nav-mid-link").offsetTop;
		const botEdgeY = document.querySelector(".feed-nav-mid-link").offsetTop + document.querySelector(".feed-nav-mid-link").offsetHeight;
		const relativeMouseY = e.pageY - e.target.getBoundingClientRect().y
		if(e.type === "mouseenter"){
			marker.style.transition = "all 0s";
		
			if(relativeMouseY <= topEdgeY - 2) {
				link = topLink;
			} else if(relativeMouseY > botEdgeY) {
				link = botLink;
			} else {
				link = midLink;
			}
			
			marker.style.width = (link.offsetWidth + 16)+'px';
			marker.style.top = (link.offsetTop - 2)+'px';
			marker.style.left = (link.offsetLeft - 8)+'px';
			marker.style.height = (link.offsetHeight + 4)+'px';
			marker.style.transition = "transform 0.3s, top 0.3s, left 0.3s, height 0.3s, width 0.3s, color 0.3s, box-shadow 0.3s, opacity 0.3s";
			marker.style.opacity = "1";
			marker.style.transform = "rotateX(0deg)";
		}

		else if(e.type === "mouseleave"){

			if(relativeMouseY < topEdgeY) {
				link = topLink;
			} else if(relativeMouseY > botEdgeY) {
				link = botLink;
			} else {
				link = midLink;
			}

			marker.style.transition = "transform 0.3s, top 0.3s, left 0.3s, height 0.3s, width 0.3s, color 1.3s, background-color 0.3s, box-shadow 0.3s, opacity 0.8s";
			marker.style.opacity = "0";
			marker.style.transform = "rotateX(90deg) skewX(10deg)";
			marker.style.boxShadow = ""
		}
	}

	const shiftMarker = (e) => {
		e.stopPropagation();
		const marker = document.querySelector(".hover-marker")
		const link = e.currentTarget.querySelector('a');
		if(e.type==="mouseenter") {
			marker.style.top = (link.offsetTop - 2)+'px';
			marker.style.left = (link.offsetLeft - 7)+'px';
			marker.style.height = (link.offsetHeight + 4)+'px';
			marker.style.width = (link.offsetWidth + 16)+'px';
			link.classList.contains("active") ? link.style.color = "navy" : link.style.color = "white";
			// link.classList.contains("active") ? link.style.color = "navy" : link.style.color = "navy";
			link.classList.contains("active") ? marker.style.boxShadow = "2px 2px black" : marker.style.boxShadow = "2px 2px plum";
			
			marker.style.opacity = "1";
			marker.style.transform = "rotateX(0deg) skewX(0deg)";
			marker.style.transition = "transform 0.3s, top 0.3s, left 0.3s, height 0.3s, width 0.3s, color 1.3s, background-color 0.3s, box-shadow 0.3s, opacity 0.8s";
			
		}
		if(e.type==="mouseleave") {
			link.classList.contains("active") ? link.style.color = "#F2490C" : link.style.color = "black";
			marker.style.boxShadow = ""
		}
	}

	const toggleGoalsOnly = (e) => {
		setGoalsOnly(oldval => !oldval)
		if(workoutsOnly) setWorkoutsOnly(false)
	}

	const toggleWorkoutsOnly = (e) => {
		setWorkoutsOnly(oldval => !oldval)
		if(goalsOnly) setGoalsOnly(false)
	}

	const displayTooltip = (e) => {
		e.stopPropagation();
		const tooltip = e.currentTarget.querySelector(".feed-nav-tooltip")
		tooltip.style.transition = "all 0.1s 0.5s";
		tooltip.style.opacity = "1";
	}

	const hideTooltip = (e) => {
		e.stopPropagation();
		const tooltip = e.currentTarget.querySelector(".feed-nav-tooltip")
		tooltip.style.transition = "all 0.1s 0s";
		tooltip.style.opacity = "0";
	}

	useEffect(() => {

		document.addEventListener("scroll", handleScroll)

		const links = document.querySelector(".follow-nav-bar-container").querySelectorAll("li");
		links.forEach(link => {
			link.addEventListener("mouseenter", shiftMarker)
			link.addEventListener("mouseleave", shiftMarker)
		})
		return () => {
			links.forEach(link => {
				link.removeEventListener("mouseenter", shiftMarker)
				link.removeEventListener("mouseleave", shiftMarker)
			})
			document.removeEventListener("scroll", handleScroll)
		}
	}, [])

	return (
		<div className="follow-nav-bar-container-outer">
		<div className={`follow-nav-bar-container  ${scrolledFeed ? "scrolled-follow-nav-bar" : ""}`} >
			<div className="hover-marker" ></div>
			<div className={`feed-links-box`} onMouseEnter={resetMarker} onMouseLeave={resetMarker}>
				<ul className="feed-links-list">
					{/* <li className="feed-nav-link feed-nav-top-link"><NavLink exact to={{pathname:`/discover`, discoverTriggerRerender: randomNum()}}><i class="fa-solid fa-magnifying-glass"></i>Discover</NavLink></li> */}
					<li className="feed-nav-link feed-nav-top-link"><NavLink exact to={{pathname:`/discover`, discoverTriggerRerender: randomNum()}}>Discover</NavLink></li>
					{/* <li className="feed-nav-link feed-nav-mid-link"><NavLink exact to={`/feed`}><i class="fa-solid fa-house"></i>Follows</NavLink></li> */}
					<li className="feed-nav-link feed-nav-mid-link"><NavLink exact to={`/feed`}>Follows</NavLink></li>
					{/* <li className="feed-nav-link feed-nav-bot-link"><NavLink exact to={`/feed/${sessionUser._id}`}><i class="fa-solid fa-user"></i>{sessionUser.username}</NavLink></li> */}
					<li className="feed-nav-link feed-nav-bot-link"><NavLink exact to={`/feed/${sessionUser._id}`}>{sessionUser.username}</NavLink></li>
				</ul>
			</div>
			<div className="post-type-filter-container">
				<div className={`post-filter-option post-type-filter-goals ${goalsOnly ? "active-filter" : ""}`} onClick={toggleGoalsOnly} onMouseEnter={displayTooltip} onMouseLeave={hideTooltip}>
					<i className="fa-solid fa-arrows-to-circle"></i>
					<div className="feed-nav-tooltip goals-tooltip">Goals</div>
				</div>
				<div className={`post-filter-option post-type-filter-workouts ${workoutsOnly ? "active-filter" : ""}`} onClick={toggleWorkoutsOnly} onMouseEnter={displayTooltip} onMouseLeave={hideTooltip}>
					<i className="fa-solid fa-person-running"></i>
					<div className="feed-nav-tooltip workouts-tooltip">Workouts</div>
				</div>
			</div>
		</div>
		</div>
	)
}

export default FollowNavBar;
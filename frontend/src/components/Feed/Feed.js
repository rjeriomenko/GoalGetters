import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { fetchAllUserGoals, fetchUserGoals, fetchFollowsGoals, fetchDiscoversGoals, getFollowsGoals, getDiscoversGoals } from '../../store/goals';
import { fetchFollowsExerciseEntries, fetchUserExerciseEntries, getFollowsExerciseEntries, getUserExerciseEntries, fetchDiscoversExerciseEntries, getDiscoversExerciseEntries } from '../../store/exerciseEntries';
import { fetchFollows, getFollows } from '../../store/follows';
import FollowNavBar from './FollowNavBar';
import FeedPostWorkout from './FeedPostWorkout';
import FeedPostGoal from './FeedPostGoal';
import './Feed.css';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import TestProps from './TestProps';
import { useLocation } from 'react-router-dom';
import { fetchUser } from '../../store/users';
import { getUser } from '../../store/users';

// Sort posts by most recent.
export const sortFeedPostsBy = (postsArray, sortRule) => {
  
  let sortedArray;
  switch(sortRule) {
    case "date":
      sortedArray = postsArray.toSorted((a, b) => {
        return new Date(b.date ? b.date : b.deadline) - new Date(a.date ? a.date : a.deadline)
      })    
      break;
    case "deadline":
      sortedArray = postsArray.toSorted((a, b) => {
        return new Date(b.deadline) - new Date(a.deadline)
      })    
      break;
    default:
      sortedArray = "PLEASE SPECIFY SORT FILTER";
      break;
  }
  return sortedArray;
}

// Filter posts by post options object of types:["type1", ...] and/or ownerIds:[id1, ...]
export const filterPostsBy = (postsArray, options = {}) => {
  const { types, ownerIds } = options;
  
  const filteredArray = postsArray.filter(post => {
    return (types ? types.includes(post.type) : true) && (ownerIds ? ownerIds.includes(post.user?._id) : true);
  })
  
  return filteredArray;
}

function Feed ({discoverMode, options = {}}) {
  const dispatch = useDispatch();
  const sessionUser = useSelector(state => state.session.user);
  // const goalPosts = Object.values(useSelector(getUserGoals)); - preferred way
  const goalPosts = useSelector(state => state.goals?.user ? Object.values(state.goals.user) : []); // -- less preferred way
  const workoutPosts = Object.values(useSelector(getUserExerciseEntries))
  const followsObj = useSelector(getFollows);
  const followedUserIds = Object.values(followsObj).map(obj => obj.followedUser._id)
  const followsGoalsBase = Object.values(useSelector(getFollowsGoals))
  const followsGoals = followsGoalsBase.flat()
  const followsWorkoutsBase = Object.values(useSelector(getFollowsExerciseEntries));
  const followsWorkouts = followsWorkoutsBase.flat()
  const discoverGoals = Object.values(useSelector(getDiscoversGoals));
  const discoverWorkouts = Object.values(useSelector(getDiscoversExerciseEntries));
  
  const userId = useParams().userId
  const notSessionUser = useSelector(getUser(userId));

  const filterOptions = {...options};

  // Local state - for filtering!
  const [goalsOnly, setGoalsOnly] = useState(false);
  const [workoutsOnly, setWorkoutsOnly] = useState(false);

  // If discoverMode, pull random number to always rerender component if navigate to it from within component.
  // This is added to dependency array to trigger rerender if we click on "Discover"
  const {discoverTriggerRerender} = useLocation();

  useEffect(() => {
    // If only want feed items for a specific user
    if(userId) {
      dispatch(fetchUserGoals(userId))
      dispatch(fetchUserExerciseEntries(userId))
      dispatch(fetchFollows(userId))
      if(sessionUser._id !== userId) dispatch(fetchUser(userId))
    }

    // Otherwise want "megafeed" consisting of:
    else {
      // Session user's items
      dispatch(fetchUserGoals(sessionUser._id))
      dispatch(fetchUserExerciseEntries(sessionUser._id))
      dispatch(fetchFollows(sessionUser._id))
      
      // Follows items
      dispatch(fetchFollowsGoals())
      dispatch(fetchFollowsExerciseEntries())

      // Discover items
      if(discoverMode) {
        dispatch(fetchDiscoversGoals()) // doesn't do anything yet - pending backend route
        dispatch(fetchDiscoversExerciseEntries()) // doesn't do anything yet - pending backend route

      }
    }

    const marker = document.querySelector('.hover-marker')
    marker.style.transition = "all 0.1s";
    marker.style.opacity = '0';


    // Cleanup:
    // return () => dispatch(clearFeedPostErrors());
  }, [dispatch, discoverTriggerRerender, userId, discoverMode])

  if(userId) {
    filterOptions.ownerIds ||= [userId];
  }

  // Filter each GOAL and WORKOUT posts by desired userIds then combine them and sort by options (usually last updated)
  const filteredGoalPosts = filterPostsBy(goalPosts, filterOptions);
  const filteredWorkoutPosts = filterPostsBy(workoutPosts, filterOptions);
  const filteredFollowGoalPosts = filterPostsBy(followsGoals, filterOptions);
  const filteredFollowWorkoutPosts = filterPostsBy(followsWorkouts, filterOptions);
  const filteredDiscoversGoalPosts = filterPostsBy(discoverGoals, filterOptions);
  const filteredDiscoversWorkoutPosts = filterPostsBy(discoverWorkouts, filterOptions);

  const combinedGoals =
    userId ? [...filteredGoalPosts] : 
    discoverMode ? [...filteredDiscoversGoalPosts].filter(post => post.user?._id !== sessionUser?._id).filter(post => !followedUserIds.includes(post.user?._id))
      : [...filteredFollowGoalPosts, ...filteredGoalPosts].filter(post => post.user?._id !== sessionUser?._id);
      
  const combinedWorkouts = 
    userId ? [...filteredWorkoutPosts] : 
    discoverMode ? [...filteredDiscoversWorkoutPosts].filter(post => post.user?._id !== sessionUser?._id).filter(post => !followedUserIds.includes(post.user?._id))
      : [...filteredFollowWorkoutPosts, ...filteredWorkoutPosts].filter(post => post.user?._id !== sessionUser?._id);

  const combinedPosts = goalsOnly ? combinedGoals : (workoutsOnly ? combinedWorkouts : [...combinedGoals, ...combinedWorkouts]);

  // Fix to ensure no duplicates:
  const uniquePosts = [];
  const map = new Map();
  for (const post of combinedPosts) {
    if(!map.has(post._id)){
      map.set(post._id, true);
      uniquePosts.push(post);
    }
  }

  const sortedCombinedPosts = sortFeedPostsBy(uniquePosts, "date");

  
  // Conditional header text
  let headerText;
  if(userId){
    if(userId === sessionUser._id) headerText = "your goals and workouts"
    else {
      headerText = `${notSessionUser?.username?.concat("'s goals and workouts")}`
    }
  } else if(discoverMode){
    headerText = "other amazing goalgetters";
  } else {
    // headerText = "together is better"
    headerText = "your community"
  }

  const renderHeaderText = () => {
    const headerLetters = headerText.split("").map((char, idx) => {
      return <span style={{animationDelay: `${(idx + 1) * 0.015}s`}} key={'key' + idx} className='feed-header-letter'>{char}</span>
    })
    return headerLetters;
  }

  const renderPosts = () => {
    if (sortedCombinedPosts.length === 0) {
      let emptyText;
      if(sessionUser._id === userId) emptyText = "Nothing here yet. Create a goal / add a workout, or click Discover to get inspired!";
      else emptyText = `Nothing here yet. Check out Discover for more inspiration!`
      return (
        <>
        <div className='empty-feed-container'>
          <div>{emptyText}</div>
        </div>
        </> 
      )
    }
    return sortedCombinedPosts.map((goalPost, index) => goalPost.deadline ?
      <FeedPostGoal key={goalPost._id} feedPost={goalPost} />
      : <FeedPostWorkout key={goalPost._id} feedPost={goalPost} />
    )
  }

  return (
    <>
      <h2 className='feed-header'>{renderHeaderText()}</h2>
      <div className='feed-posts-container'>
        <FollowNavBar goalsOnly={goalsOnly} setGoalsOnly={setGoalsOnly} workoutsOnly={workoutsOnly} setWorkoutsOnly={setWorkoutsOnly}/>
        <div className='inner-feed-posts-container'>
          {renderPosts()}
        </div>
        <div className='filler-div'>{/* Exists to balance FollowNavBar and center inner-feed-posts-container */}</div>
      </div>
    </>
  );
}

export default Feed;
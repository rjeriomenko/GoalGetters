import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { fetchAllUserGoals, fetchUserGoals, fetchFollowsGoals, fetchDiscoversGoals, getFollowsGoals, getDiscoversGoals } from '../../store/goals';
import { fetchUserExerciseEntries, getUserExerciseEntries } from '../../store/exerciseEntries';
import { fetchFollows, getFollows } from '../../store/follows';
import FollowNavBar from './FollowNavBar';
import FeedPostWorkout from './FeedPostWorkout';
import FeedPostGoal from './FeedPostGoal';
import './Feed.css';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';

// Sort posts by most recent.
export const sortFeedPostsBy = (postsArray, sortRule) => {
  let sortedArray;
  switch(sortRule) {
    case "updatedAt":
      sortedArray = postsArray.toSorted((a, b) => {
        return new Date(b.updatedAt) - new Date(a.updatedAt)
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
    return (types ? types.includes(post.type) : true) && (ownerIds ? ownerIds.includes(post.user._id) : true);
  })
  
  return filteredArray;
}

function Feed ({discoverMode, options = {}}) {
  const dispatch = useDispatch();
  const sessionUser = useSelector(state => state.session.user);
  const goalPosts = useSelector(state => state.goals?.user ? Object.values(state.goals.user) : []);
  const workoutPosts = Object.values(useSelector(getUserExerciseEntries))
  const follows = useSelector(getFollows);
  const followsGoalsBase = Object.values(useSelector(getFollowsGoals))
  // const followWorkoutsBase = //pending backend route / thunk
  
  const followsGoals = followsGoalsBase.flat()
  const userId = useParams().userId
  
  const filterOptions = {...options};
	const [triggerRender, setTriggerRender] = useState(1);
  
  useEffect(() => {
    // If only want feed items for a specific user
    if(userId) {
      dispatch(fetchUserGoals(userId))
      dispatch(fetchUserExerciseEntries(userId))
      dispatch(fetchFollows(userId))
      
    }

    // Otherwise want "megafeed" consisting of:
    else {
      // Session user's items
      dispatch(fetchUserGoals(sessionUser._id))
      dispatch(fetchUserExerciseEntries(sessionUser._id))
      dispatch(fetchFollows(sessionUser._id))

      // Follows items
      dispatch(fetchFollowsGoals())
      // dispatch fetchFollowsWorkouts // doesn't do anything yet - pending backend route

      // Discover items
      // dispatch(fetchDiscoversGoals()) // doesn't do anything yet - pending backend route
      // dispatch(fetchDiscoversWorkouts()) // doesn't do anything yet - pending backend route
    }

    // dispatch(fetchAllUserGoals()) - do not use this thunk it will not work. Use updated thunks

    // Cleanup:
    // return () => dispatch(clearFeedPostErrors());
  }, [dispatch])

  if(userId) {
    filterOptions.ownerIds ||= [userId];
  }

  // Filter each GOAL and WORKOUT posts by desired userIds then combine them and sort by options (usually last updated)
  const filteredGoalPosts = filterPostsBy(goalPosts, filterOptions);
  const filteredWorkoutPosts = filterPostsBy(workoutPosts, filterOptions);
  // console.log(followsGoals)
  const filteredFollowGoalPosts = filterPostsBy(followsGoals, filterOptions);
  const combinedPosts = userId ? [...filteredGoalPosts, ...filteredWorkoutPosts] : [...filteredGoalPosts, ...filteredWorkoutPosts, ...filteredFollowGoalPosts];
  const sortedCombinedPosts = sortFeedPostsBy(combinedPosts, "updatedAt");

  // Conditional header text
  let headerText;
  if(userId){
    if(userId === sessionUser._id) headerText = "your goals and workouts"
    // else headerText = `${sortedGoalPosts ? sortedGoalPosts[0].setter.concat(`...`) : "nothing here..."}`
    else {
      headerText = `${sortedCombinedPosts?.length ? sortedCombinedPosts[0].user.username?.concat("'s goals and workouts") : "nothing here..."}`
    }
  } else if(discoverMode){
    headerText = "other amazing goalgetters";
  } else {
    headerText = "together is better"
  }

  if (sortedCombinedPosts.length === 0) {
    return (
      <>
      <div className='feed-posts-container'>
        <h2>No posts yet. Create a goal or checkout what others have been up to in Discover!</h2>
      </div>
      </> 
    )
  }

  const renderHeaderText = () => {
    const headerLetters = headerText.split("").map((char, idx) => {
      return <span style={{animationDelay: `${(idx + 1) * 0.015}s`}} className='feed-header-letter'>{char}</span>
    })
    return headerLetters;
  }

  const renderPosts = () => {
    
    return sortedCombinedPosts.map((goalPost, index) => goalPost.deadline ?
      <FeedPostGoal key={goalPost._id} feedPost={goalPost} triggerRender={triggerRender} setTriggerRender={setTriggerRender} />
      : <FeedPostWorkout key={goalPost._id} feedPost={goalPost} triggerRender={triggerRender} setTriggerRender={setTriggerRender} />
    )
  }

  return (
    <>
      <h2 className='feed-header'>{renderHeaderText()}</h2>
      <div className='feed-posts-container'>
        <FollowNavBar />
        <div className='inner-feed-posts-container'>
          {renderPosts()}
        </div>
      </div>
    </>
  );
}

export default Feed;
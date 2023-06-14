import "./FeedPostEditable.css"
import { useState } from "react";
import { useSelector } from "react-redux";
import { POST_TYPE_GOAL, POST_TYPE_EXERCISE_ENTRY } from "./Feed";
import { useEffect } from "react";
// import { Link } from "react-router-dom";

function FeedPostEditable ({feedPost, type}) {
  // const { text, author } = feedPost;
  // const { username } = author;
  const { title, description, deadline, completionDate, exerciseEntries, updatedAt } = feedPost;
	exerciseEntries ||= [];
	// let username = undefined;
	// let timestamp = undefined;
	// let contentString = undefined;
	const [username, setUsername] = useState("undefined-user")
	const [timestamp, setTimeStamp] = useState('')
	// const [contentString, setContentString] = useState('')
	const [content, setContent] = useState('');
	const [editable, setEditable] = useState(false);
	const loggedIn = useSelector(state => !!state.session.user);
	// need logic for if sessionUser === post's author
	// debugger

	const handleContentChange = e => {
		setContent(e.target.value);
		e.target.style.height = "auto";
		e.target.style.height = e.target.scrollHeight + "px";
	}

	const handleUpdate = e => {
		setEditable(false);
		const updatedPost = { title, description, deadline, completionDate, exerciseEntries, updatedAt }
	}

	useEffect(() => {
		switch(type){
			case POST_TYPE_EXERCISE_ENTRY:
				break;
			case POST_TYPE_GOAL:
				// username
				setTimeStamp(new Date(completionDate ? completionDate : updatedAt).toLocaleDateString('en-us', { weekday:"short", month:"short", day:"numeric"})) 
				// timestamp = completionDate ? completionDate : updatedAt;
				// exerciseEntries ||= [];
				const contentString = 
					(title ? title + " " : "") + 
					(description ? description + " " : "") + 
					(exerciseEntries[exerciseEntries.length - 1] ? exerciseEntries[exerciseEntries.length - 1] + " " : "")
					;
				setContent(contentString);
				break;
			default: 
				break;
		}
	}, [])

	console.log("Hi", timestamp)

  return (
		<div className="feedPostBlock feed-post-editable-container">
			{/* CONTENT - START */}
			{/* CONTENT - START */}
			<div className="feed-post-content">
				<div className="feed-post-row">
					<div className="post-username">{username}</div>
					<div>{timestamp}</div>
				</div>
				<br/>
				{!editable && <div className="feed-post-row">
					<span className="post-goal-title">{title}</span>
					<span>·</span>
					<span className="post-goal-description">{description}</span>
				</div>}
				
				{editable && <>
					<textarea id="feed-post-text-edit"
						contentEditable={true}
						value={content}
						onChange={handleContentChange}
					/>
					<div className="feed-post-crud-button" onClick={handleUpdate}>Update</div>
				</>}
				<div className="post-divider"></div>
				<div>
					{exerciseEntries[exerciseEntries.length - 1] ? exerciseEntries[exerciseEntries.length - 1] + " " : "No workouts yet"}
				</div>
			</div>
			{/* CONTENT - END */}
			{/* CONTENT - END */}

			{/* CRUD BUTTONS - START */}
			{/* CRUD BUTTONS - START */}
			<div className="feed-post-crud-controls">
				<div className="feed-post-crud-button" onClick={e => setEditable(true)}>
					Update
				</div>
				<div className="feed-post-crud-button">Delete</div>
			</div>
			{/* CRUD BUTTONS - END */}
			{/* CRUD BUTTONS - END */}
		</div>
  );
}

export default FeedPostEditable;
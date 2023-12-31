import { useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import { deleteGoal, updateGoal } from '../../store/goals'
import './GoalIndexItem.css'

function GoalIndexItem ({goal}) {
    const dispatch = useDispatch();
    const [showMenu, setShowMenu] = useState(false);
	const [editable, setEditable] = useState(false);
    const [title, setTitle] = useState(goal.title)
    const [description, setDescription] = useState(goal.description)
    const [image, setImage] = useState(null);

    const handleDescriptionChange = e => {
		setDescription(e.target.value);
		e.target.style.height = "auto";
		e.target.style.height = e.target.scrollHeight + "px";
	}

    const handleUpdateGoal = e => {
		setEditable(false);
		const updatedGoal = { ...goal, title, description}
		dispatch(updateGoal(updatedGoal));
	}

    const openMenu = () => {
        if (showMenu) return;
        setShowMenu(true);
    };

    const handleDel = e => {
        e.preventDefault();
        dispatch(deleteGoal(goal._id))
    }

    const handleToggleForm = e => {
		setEditable(oldSetEditable => {
			if(oldSetEditable){
				setTitle(title);
				setDescription(description);
			}
			return !oldSetEditable
		})
	}

    const renderGoalImg = () => {
        return (
            <img className="goal-page-picture" src={goal.imgUrl? goal.imgUrl : "https://aws-fiton.s3.amazonaws.com/sheng-hu-_Hnue6LxhLY-unsplash.jpg"} />
        )
    }

    const updateFile = e => setImage(e.target.files[0]);

    useEffect(() => {
        if (!showMenu) return;
    
        const closeMenu = () => {
          setShowMenu(false);
        };
    
        document.addEventListener('click', closeMenu);
        return () => document.removeEventListener("click", closeMenu);
    }, [showMenu]);

    return (
        <>  
            <div className="grid-item-container">
                
            {!editable ? ( 
                <div className="grid-item-previous" id="previous-goal">
                    <p className="goal-title">{title}</p>
                    <p>{description}</p>
                        {renderGoalImg()}
                    <div className="complete-date">
                        <p>Completed: {goal.deadline}</p>
                    </div>
                </div>
            ) : (
                <div className="feed-post-content">
                    <label>Title
                    <input
                        className="feed-post-text-edit"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    </label>

                    <label>Description
                    <textarea
                        className="feed-post-text-edit"
                        contentEditable={true}
                        value={description}
                        onChange={handleDescriptionChange}
                    />
                    </label>

                    <label>Update Image
						<input type="file" accept=".jpg, .jpeg, .png" id="imageInput" onChange={updateFile} />
					</label>

                    <div className="feed-post-update-button" onClick={handleUpdateGoal}>Update</div>
                    <div className="feed-post-update-button" onClick={handleToggleForm}>Cancel</div>
                </div>
            )}

                <div className="ellipsis" onClick={openMenu}>
                    <i id="ellipsis" className="fas fa-light fa-ellipsis-vertical"></i>
                </div>

                {showMenu && (
                    <ul className="goal-dropdown">
                        <li onClick={e => setEditable(oldSetEditable => !oldSetEditable)}>
                            <i className="far fa-edit"></i>
                        </li>
                        <div id="goal-dropdown-line"></div>
                        <li onClick={handleDel}>
                            <i className="fa-solid fa-trash-can"></i>
                        </li>
                    </ul>
                )}

            </div>
        </>
    )
};

export default GoalIndexItem;
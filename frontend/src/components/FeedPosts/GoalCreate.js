import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearFeedPostErrors, createFeedPost } from '../../store/feedPosts';
import FeedPostBlock from './FeedPostBlock';
import './GoalCreate.css';

function GoalCreate () {
  const today = new Date().toISOString().split('T')[0];
  const [text, setText] = useState('');
  const [date, setDate] = useState(today);
  const dispatch = useDispatch();
  const author = useSelector(state => state.session.user);
  const newFeedPost = useSelector(state => state.feedPosts.new);
  const errors = useSelector(state => state.errors.feedPosts);

  useEffect(() => {
    return () => dispatch(clearFeedPostErrors());
  }, [dispatch]);

  const handleSubmit = e => {
    e.preventDefault();
    dispatch(createFeedPost({ text, date })); 
    setText('');
    setDate(today);

  };

  return (
    <>
      <div className="create-feed-post-container">
        <form className="create-feed-post" onSubmit={handleSubmit}>
          <input 
            className="feed-post-form-text"
            type="textarea"
            value={text}
            onChange={e => setText(e.currentTarget.value)}
            placeholder={`Set your next goal, ${author.username}!`}
            required
          />

          <div className="errors">{errors?.text}</div>
          
          <span>Target Deadline</span>
          <input 
            type="date"
            className="feed-post-form-date"
            value={date}
            onChange={e => setDate(e.currentTarget.value)}
          />

          <input 
            className="create-feed-post-submit"
            type="submit" 
            value="Submit" />
        </form>

        <div className="feed-post-preview">
          <h3>Feed Post Preview</h3>
          {text ? <FeedPostBlock feedPost={{text, author}} /> : undefined}
        </div>

        <div className="previous-feed-post">
          <h3>Previous Feed Post</h3>
          {newFeedPost ? <FeedPostBlock feedPost={newFeedPost} /> : undefined}
        </div>
      </div>
    </>
  )
}

export default GoalCreate;
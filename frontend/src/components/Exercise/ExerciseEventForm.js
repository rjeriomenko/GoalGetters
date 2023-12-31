import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createExerciseEntry, clearExerciseEntryErrors } from '../../store/exerciseEntries';
import { createExercise, fetchGoalExercises } from '../../store/exercises';
import exerciseList from './ExerciseList';
import Fuse from 'fuse.js';
import './ExerciseEventForm.css'

function ExerciseEventForm ({headerQuote, setShowExerciseEntry}) {
    const dispatch = useDispatch();
    const today = new Date();
    const currentDate = new Date().toLocaleDateString('en-us', { weekday: 'long', year: 'numeric', month: 'numeric', day: 'numeric', hour12: true });
    const [date, setDate] = useState(today);
    const [note, setNote] = useState('');
    const [rating, setRating] = useState('');
    const [image, setImage] = useState(null);
    const [fuzzyResults, setFuzzyResults] = useState([]);
    const [exerciseInputs, setExerciseInputs] = useState([{ name: '', sets: '', reps: '', time: '', weight: '' }]);
    const [formIndex, setFormIndex] = useState(null);
    const errors = useSelector(state => state.errors.exerciseEntries)

    const sessionUser = useSelector(state => state.session.user);
    const currentGoal = sessionUser?.currentGoal;
    const currentGoalId = currentGoal?._id;

    const options = {
        keys: ['exercise'],
        threshold: 0.3
    };

    const exerciseOptions = exerciseList;
    const fuse = new Fuse(exerciseOptions.map(exercise => ({ exercise })), options);

    const handleFuzzyChange = (value, index) => {
        const results = fuse.search(value);

        if (results.length > 0) {
            const matchedExercise = results[0].item.exercise;
            const updatedInputs = exerciseInputs.map((input, i) => {
                if (i === index) {
                    return { ...input, name: matchedExercise };
                }
                return input;
            });
            setExerciseInputs(updatedInputs);
        }

        setFuzzyResults(results);
        
    };

    const handleFuzzySelect = (result, index) => {
        const selectedExercise = result.item.exercise;
        const inputs = exerciseInputs.map((input, i) => {
            if (i === index) {
              return { ...input, name: selectedExercise };
            }
            return input;
        });

        setExerciseInputs(inputs);
        setFuzzyResults([]);
    };

    const handleInputChange = (e, index) => {
        const { name, value } = e.target;
        const inputs = [...exerciseInputs]; 
        
        if (name === 'name') {
            handleFuzzyChange(value, index);
            setFormIndex(index);
        }

        inputs[index] = { ...inputs[index], [name]: value };

        setExerciseInputs(inputs);
    };

    const addInputFields = (e) => {
        e.preventDefault();
        setExerciseInputs([...exerciseInputs, { name: '', sets: '', reps: '', time: '', weight: '' }]);
    };

    const removeInputField = (index) => {
        const inputs = [...exerciseInputs];
        inputs.splice(index, 1);
        setExerciseInputs(inputs);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        dispatch(createExerciseEntry( currentGoalId, { date, note, image, rating: Number(rating) }))
            .then((res) => {
                setShowExerciseEntry(false)

                const exerciseEntryId = Object.keys(res)[0];
                const createExercisePromises = exerciseInputs.map((exercise) =>
                    dispatch(createExercise(exerciseEntryId, exercise))
                    .then(() => dispatch(fetchGoalExercises(currentGoalId)))
                );
                

                Promise.all(createExercisePromises)
            })
    };

    const updateFile = e => setImage(e.target.files[0]);

    useEffect(() => {
        return () => dispatch(clearExerciseEntryErrors());
    }, [dispatch])

    return (
        <div className="exercise-form-container">
            <h4 className="header-quote">{headerQuote}</h4>
            {currentGoal ? <h2>· {currentGoal.title} ·</h2> : null }
            <br></br>
            <span className="workout-form-date">Today's Workout for <span id="exercise-form-date">{currentDate}</span></span>
            <div className="workout-form-line" id="line-one"></div>
            <form className="exercise-form" onSubmit={handleSubmit}>
                <div className="exercise-entry-form">
                    <span>Rating</span>
                    <input
                        type="number"
                        min="1"
                        max="5"
                        value={rating}
                        onChange={e => setRating(e.currentTarget.value)}
                        required
                    />
                    <div className="errors">{errors?.rating}</div>
                    
                    <span>Notes</span>
                    <input
                        type="textarea"
                        value={note}
                        onChange={e => setNote(e.currentTarget.value)}
                        placeholder="How was your workout?"
                        required
                    />
                    <div className="errors">{errors?.note}</div>

                    <span>Upload Image</span>
                    <input type="file" accept=".jpg, .jpeg, .png" id="imageInput" onChange={updateFile} />

                </div>
                
                <div className="exercise-input-container">
                    {exerciseInputs.map((input, index) => (
                        <>
                            <div className="workout-form-line"></div>
                            <div id="exercise-input-div" key={index} className={`exercise-div-${index}`}>
                                <span id="exercise-input-span">Exercise</span>
                                <input
                                    type="text"
                                    name="name"
                                    autoComplete="off"
                                    placeholder="Push-ups, Running..."
                                    value={input.name}
                                    onChange={(e) => handleInputChange(e, index)}
                                    required
                                />
                                
                                {index === formIndex && fuzzyResults.length > 0 && (
                                    <ul className="fuzzy-dropdown">
                                        {fuzzyResults.map((result) => (
                                        <li
                                            key={result.refIndex}
                                            className="fuzzy-dropdown-item"
                                            onClick={() => handleFuzzySelect(result, index)}
                                        >
                                            {result.item.exercise}
                                        </li>
                                        ))}

                                    </ul>)
                                }
                                
                                <div className="errors">{errors?.name}</div>

                                <span id="exercise-input-span">Sets</span>
                                <input
                                    type="number"
                                    min="1"
                                    max="1000000"
                                    name="sets"
                                    value={input.sets}
                                    onChange={(e) => handleInputChange(e, index)}
                                />
                                <div className="errors">{errors?.sets}</div>

                                <span id="exercise-input-span">Reps</span>
                                <input
                                    type="number"
                                    min="1"
                                    max="1000000"
                                    name="reps"
                                    value={input.reps}
                                    onChange={(e) => handleInputChange(e, index)}
                                />
                                <div className="errors">{errors?.reps}</div>

                                <span id="exercise-input-span">Weight (lbs)</span>
                                <input
                                    type="number"
                                    min="1"
                                    max="1000000"
                                    name="weight"
                                    value={input.weight}
                                    onChange={(e) => handleInputChange(e, index)}
                                />
                                <div className="errors">{errors?.weight}</div>

                                <span id="exercise-input-span">Time (minutes)</span>
                                <input
                                    type="number"
                                    min="1"
                                    max="1000000"
                                    name="time"
                                    value={input.time}
                                    onChange={(e) => handleInputChange(e, index)}
                                    required
                                />
                                <div className="errors">{errors?.time}</div>

                                {index > 0 && (
                                    <button
                                        type="submit"
                                        value="Delete"
                                        className="exercise-input-delete-btn"
                                        onClick={() => removeInputField(index)}>
                                        <i className="fa-solid fa-trash-can"></i>
                                    </button>
                                )}
                            </div>
                        </>
                    ))}
                </div>
                <div className="exercise-event-form-btn-container">
                    <input className="exercise-event-form-btn" type="submit" value="Add Another Exercise" onClick={addInputFields} />
                    <input className="exercise-event-form-btn" type="submit" value="Submit" />
                </div>
            </form>
        </div>
    );
}

export default ExerciseEventForm;

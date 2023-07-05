import './ExerciseEntryTile.css';

import { formatTwoDigitNumberString } from '../../utils/utils';

const ExerciseEntryTile = ({photoNum, rating, dateText, note, entry}) => {
	debugger
	const dateParts = dateText.split('-').map(part => {
		return <span>{part}</span>
	})

	const animateOnce = (e) => {
		const workoutContainer = e.currentTarget;
		const workoutImg = workoutContainer.querySelector(".tile-photo");
		workoutContainer.classList.add("tile-container-hover");
		workoutImg.classList.add("tile-img-hover");
	}

	const reverseAnimation = (e) => {
		const workoutContainer = e.currentTarget;
		const workoutImg = workoutContainer.querySelector(".tile-photo");
		workoutContainer.classList.remove("tile-container-hover");
		workoutImg.classList.remove("tile-img-hover");
	}

	return (
		<div className='exercise-outer-container' onMouseEnter={animateOnce} onMouseLeave={reverseAnimation}>
			<div className={`exercise-entry-tile-container `}>
				<img className="tile-photo" src={require(`../../images/${photoNum}.png`)}/>
			</div>
			<div className={`tile-rating-overlay tile-rating-${rating}`}>
				<div className={`tile-date-text`}>{dateParts}</div>
			</div>
		</div>
	)
}

export default ExerciseEntryTile;
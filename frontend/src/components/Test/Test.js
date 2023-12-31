import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { 
    fetchUserGoals, 
    createGoal, 
    updateGoal, 
    deleteGoal,
    fetchFollowsGoals,
    fetchDiscoversGoals,
    getGoal, 
    getGoals, 
    getUserGoals,
    getNewGoal 
} from '../../store/goals';

import {
    fetchUserExerciseEntries,
    createExerciseEntry,
    updateExerciseEntry,
    deleteExerciseEntry,
    fetchFollowsExerciseEntries,
    fetchDiscoversExerciseEntries,
    fetchGoalExerciseEntries
} from '../../store/exerciseEntries';

import {
    receiveFollowsUsers,
    updateUser
} from '../../store/users';

import {
    fetchUserExercise,
    fetchUserExercises,
    fetchAllUserExercises,
    fetchGoalExercises,
    fetchWorkoutExercises,
    createExercise,
    updateExercise,
    deleteExercise,
} from '../../store/exercises';


function LandingPage() {
    const dispatch = useDispatch();
    
    window.dispatch = dispatch;
    window.fetchUserGoals = fetchUserGoals;
    window.createGoal = createGoal;
    window.updateGoal = updateGoal;
    window.deleteGoal = deleteGoal;
    window.fetchFollowsGoals = fetchFollowsGoals;
    window.fetchDiscoversGoals = fetchDiscoversGoals;

    window.fetchUserExerciseEntries = fetchUserExerciseEntries;
    window.createExerciseEntry = createExerciseEntry;
    window.updateExerciseEntry = updateExerciseEntry;
    window.deleteExerciseEntry = deleteExerciseEntry;
    window.fetchFollowsExerciseEntries = fetchFollowsExerciseEntries;
    window.fetchDiscoversExerciseEntries = fetchDiscoversExerciseEntries;
    window.fetchGoalExerciseEntries = fetchGoalExerciseEntries;

    window.fetchUserExercise = fetchUserExercise;
    window.fetchUserExercises = fetchUserExercises;
    window.fetchGoalExercises = fetchGoalExercises;
    window.fetchWorkoutExercises = fetchWorkoutExercises;
    window.fetchAllUserExercises = fetchAllUserExercises;
    window.createExercise = createExercise;
    window.updateExercise = updateExercise;
    window.deleteExercise = deleteExercise;
    
    window.receiveFollowsUsers = receiveFollowsUsers;
    window.updateUser = updateUser;

    // useEffect(() => {
    //     dispatch();
    // }, [])
    
    return (
        <>
        </>
    );
}

export default LandingPage;
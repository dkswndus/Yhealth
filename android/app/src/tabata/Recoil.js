// recoilState.js
import { atom, useRecoilState } from 'recoil';

export const timeLimitState = atom({
    key: 'timeLimitState',
    default: true,
});
export const exerciseLikesState = atom({
    key: 'exerciseLikesState',
    default: [],
});
export const likedExercisesState = atom({
    key: 'likedExercisesState',
    default: [],
});
export const selectedExercisesState = atom({
    key: 'selectedExercises',
    default: [],
});
export const dropdownValueState = atom({
    key: 'dropdownValueState',
    default: [],
});

export const exerciseOrderState = atom({
    key: 'exerciseOrderState',
    default: [],
});

export const setsState = atom({
    key: 'setsState',
    default: [],
});

export const repsState = atom({
    key: 'repsState',
    default: [],
});

export const prepareTimeState = atom({
    key: 'prepareTimeState',
    default: [],
});

export const exerciseTimeState = atom({
    key: 'exerciseTimeState',
    default: [],
});

export const restTimeState = atom({
    key: 'restTimeState',
    default: [],
});

export const isTimeLimitOnState = atom({
    key: 'isTimeLimitOnState',
    default: true,
});


export const remainingExercisesState = atom({
    key: 'remainingExercisesState',
    default: [],
});
export const setRemainingExercisesState = atom({
    key: 'setRemainingExercisesState',
    default: [],
});
export const isPausedState = atom({
    key: 'isPausedState',
    default: false,
});
export const isSoundOnState = atom({
    key: 'isSoundOnState',
    default: true,
});
export const exerciseInfoState = atom({
    key: 'exerciseInfoState',
    default: [],
});
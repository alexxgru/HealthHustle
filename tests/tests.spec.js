// @ts-check
const { test, expect } = require('@playwright/test');

test('add workout', async ({ page }) => {
  await page.goto('http://127.0.0.1:5500/');

  let workoutPlus = page.locator('#addLabel')
  await workoutPlus.click();
  let workoutInput = page.locator('#workout-form input')
  await workoutInput.type('Workout');
  let workoutSubmit = page.locator('#workout-form button')

  let pushups = await page.locator('.exercise-list li:first-child')
  await pushups.click();
  await workoutSubmit.click();

  let workout = await page.textContent('#workouts li:nth-last-child(2) h2')
  await expect(workout).toEqual('Workout');
  
});

test('add exercise', async ({ page }) => {
  await page.goto('http://127.0.0.1:5500/');

  let workoutPlus = page.locator('#addLabel')
  await workoutPlus.click();

  let exercisePlus = page.locator('#AddExerciseLabel')
  await exercisePlus.click();


  let input = page.locator('#exNameInput')
  let submit = page.locator('#checkboxes button')

  await input.type('Exercise');
  await submit.click();

  // let exercise = page.locator('#exercise-list:nth-last-child(2)');
  let exerciseName = await page.textContent('.exercise-list li:nth-last-child(2) p');
  await expect(exerciseName).toEqual('Exercise');

});

test('create workout then add exercises', async ({ page }) => {
  await page.goto('http://127.0.0.1:5500/');

  let workoutPlus = page.locator('#addLabel')
  await workoutPlus.click();
  let workoutInput = page.locator('#workout-form input')
  await workoutInput.type('Workout');
  let workoutSubmit = page.locator('#workout-form button')

  let pushups = await page.locator('.exercise-list li:first-child')
  await pushups.click();
  await workoutSubmit.click();

  //add exercise from popup
  let addBtn = await page.locator('#showExercises');
  await addBtn.click();

  let diamondpushups = await page.locator('#popupmenu ul li:first-child');
  await diamondpushups.click();

  //assure exercise is added
  let addedExercise = await page.textContent('#exercise-control > ul > li:nth-child(2) > p');

  await expect(addedExercise).toEqual('Diamond push-ups');

});

test('create workout then delete', async ({ page }) => {
  await page.goto('http://127.0.0.1:5500/');

  let workoutPlus = page.locator('#addLabel')
  await workoutPlus.click();
  let workoutInput = page.locator('#workout-form input')
  await workoutInput.type('Workout');
  let workoutSubmit = page.locator('#workout-form button')

  let pushups = await page.locator('.exercise-list li:first-child')
  await pushups.click();
  await workoutSubmit.click();

  //delete workout
  let deleteBtn = await page.locator('#deleteWorkout');
  await deleteBtn.click();

  //make sure last workout in list is 'Workout 2'
  let workout = await page.textContent('#workouts > li:nth-child(2) > h2');
  await expect(workout).toEqual('Workout 2');
});

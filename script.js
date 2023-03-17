class Exercise {
    constructor(name, description, muscleGroups) {
        this.name = name;
        this.description = description;
        this.muscleGroups = muscleGroups;

    }
}

class Workout {

    name = "";
    Wexercises = [];
    setsPerExercise = 0;
    repsPerExercise = 0;

    constructor(name, exercises, sets, reps) {
        this.name = name,
            this.Wexercises = exercises;
        this.setsPerExercise = sets;
        this.repsPerExercise = reps;
    }

    // ballpark estimates of calorie burn and duration of workout

    get calcCalories() {
        return Math.floor(this.setsPerExercise * this.repsPerExercise * this.Wexercises.length * 0.45);
    }

    get estimateTime() {
        //Seconds of rest between each set
        let restTime = 30;

        let workoutduration = ((this.repsPerExercise * this.Wexercises.length * this.setsPerExercise * 4) +
            this.setsPerExercise * restTime) / 60;

        let hours = Math.floor(workoutduration / 60);
        let minutes = Math.floor(workoutduration - hours * 60); 
        
        if (hours === 0) {
            return minutes + " m";
        }
        else {
            return hours + ' h ' + minutes +  ' m';
        }
    }
}


//
    // Vue app below
//

Vue.createApp({
    data() {
        return {
            //Variables for creating a workout
            popup: false,
            exercisesInWorkout: [],
            workoutname: "",
            alert: false,
            exercise: new Exercise("", "", ""),
            showExerciseForm: false,
            newExerciseName: "",
            newExerciseDescription: "",


            //Other
            selectedWorkout: new Workout("", [], 0, 0),
            exercises: [
            ],
            personalExcersises: [
            ],
            workouts: [
            ],

            // Dark mode
            darkmode: false
        }

    },

    watch: {
        // If darkmode changes, update value in LS
        darkmode(newVal) {
            localStorage.setItem('darkmode', newVal);
        },
    },

    methods: {
        createWorkouts() {
            //creates example workouts
            let exercisesToAdd = [];
            for (let i = 0; i < 4; i++) {
                exercisesToAdd.push(this.exercises[i])
            }
            let workout = new Workout("Workout 1", exercisesToAdd, 5, 10);

            let workout2 = new Workout("Workout 2", [this.exercises[1]], 5, 10);
            this.workouts.push(workout);
            this.workouts.push(workout2);
            this.selectedWorkout = workout;
        },
        async created() {
            return new Promise(async resolve => {
                try {
                    const response = await fetch("exercises.json");
                    const data = await response.json();

                    for (let i = 0; i < data.exercises.length; i++) {
                        let ex = new Exercise(data.exercises[i].name, data.exercises[i].description, data.exercises[i].muscleGroups)
                        this.exercises.push(ex);
                    }
                    resolve();
                }
                catch (error) {
                    console.error('Error fetching exercises:', error)
                    resolve();
                }
            })
        },


        closePopup() {
            // Hide popup and reset data
            this.popup = false;
            this.exercisesInWorkout = [];
            this.workoutname = "";
            this.showExerciseForm = false;
            this.exercise = new Exercise

        },
        addExerciseToWorkout(ex) {
            this.alert = false;

            this.showExerciseForm = false;

            // Add/remove excercise from list
            const index = this.exercisesInWorkout.findIndex(x => x.name === ex.name);
            if (index !== -1) {
                this.exercisesInWorkout.splice(index, 1);
            } else {
                this.exercisesInWorkout.push(ex);
            }
        },
        removeExerciseFromWorkout(ex){
            const index = this.selectedWorkout.Wexercises.findIndex(x => x.name === ex.name);
            this.selectedWorkout.Wexercises.splice(index, 1);
        }
        ,
        addWorkout() {
            // Must have atleast one exercise selected to create a workout
            if (this.exercisesInWorkout.length == 0) {
                this.alert = true;
                return;
            }
            let workout = new Workout(this.workoutname, this.exercisesInWorkout, 5, 10);
            this.workouts.push(workout);
            this.closePopup();
        },
        addExercise() {
            let exercise = new Exercise(this.newExerciseName, this.newExerciseDescription, 'MusclesIDK')
            this.exercises.push(exercise);
        },
        toggleDarkmode() {
            if (this.darkmode) {
                this.$el.ownerDocument.documentElement.classList.add('darkmode')
            }
            else {
                this.$el.ownerDocument.documentElement.classList.remove('darkmode')
            }
        },
        getDarkModeSettings() {
            const savedDarkmode = localStorage.getItem('darkmode');
            if (savedDarkmode !== null) {
                this.darkmode = (savedDarkmode === 'true');
            }
        }
    },
    mounted() {
        setTimeout(() => {
            document.body.classList.remove('no-transition')
        }, 500)
    },
    async beforeMount() {
        this.getDarkModeSettings();
        await this.created();
        this.createWorkouts();
        this.toggleDarkmode();
    }
}).mount("#app")
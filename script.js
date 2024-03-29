class Exercise {
    constructor(name, description, muscleGroups) {
        this.name = name;
        this.description = description;
        this.muscleGroups = muscleGroups;
        this.showDescription = false;

    }
}

class Workout {

    name = "";
    workoutExercises = [];
    setsPerExercise = 0;
    repsPerExercise = 0;
    deletable = true;

    constructor(name, exercises, sets, reps, deletable) {
        this.name = name;
        this.workoutExercises = exercises;
        this.setsPerExercise = sets;
        this.repsPerExercise = reps;
        this.deletable = deletable;
    }

    // ballpark estimates of calorie burn and duration of workout

    get calcCalories() {
        return Math.floor(this.setsPerExercise * this.repsPerExercise * this.workoutExercises.length * 0.45);
    }

    get estimateTime() {
        //Seconds of rest between each set
        let restTime = 30;

        let workoutduration = ((this.repsPerExercise * this.workoutExercises.length * this.setsPerExercise * 4) +
            this.setsPerExercise * restTime) / 60;

        let hours = Math.floor(workoutduration / 60);
        let minutes = Math.floor(workoutduration - hours * 60);

        if (hours === 0) {
            return minutes + " m";
        }
        else {
            return hours + ' h ' + minutes + ' m';
        }
    }

    get calcSvgLine() {
        let upper = 0;
        let core = 0;
        let arms = 0;
        let legs = 0;

        for (let exercise of this.workoutExercises) {
            for (let muscleGroup of exercise.muscleGroups) {
                muscleGroup === "Arms" ? arms++ : muscleGroup === "Core" ? core++ : muscleGroup === "Legs" ? legs++ : upper++;
            }
        }

        let sum = upper + core + arms + legs;

        if (sum === 0) { return }


        let values = [upper, core, arms, legs]
        let times = 0.7;

        if (values.filter(x => x > 0).length >= 2) {
            times = 1.4
        }

        let uppervalue = 80 - ((upper / sum * 100) * times);

        let legsvalue = ((legs / sum * 100) * times) + 120;

        let armsvalue = ((arms / sum * 100) * times) + 120;

        let corevalue = 80 - ((core / sum * 100) * times);


        return "M 100 " + legsvalue + " L " + armsvalue + " 100 L 100 " + uppervalue + " L " + corevalue + " 100 Z";
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
            alertName: false,
            exercise: new Exercise("", "", ""),
            showExerciseForm: false,
            addExerciseMenu: false,



            newExerciseName: "",
            newExerciseDescription: "",
            newExerciseMuscleGroup: [],

            //Other
            selectedWorkout: new Workout("", [new Exercise("", "", "")], 0, 0),
            exercises: [
            ],
            personalExercises: [
            ],
            workouts: [
            ],
            personalWorkouts: [

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
        personalExercises: {
            handler(newEx) {
                console.log('personalExercises updated', newEx);
                localStorage.setItem('exercises', JSON.stringify(newEx));
            },
            deep: true
        },
        personalWorkouts: {
            handler(newWorks) {
                console.log('personalWorkouts updated', newWorks);
                localStorage.setItem('workouts', JSON.stringify(newWorks));
            },
            deep: true
        }
    },
    methods: {
        createWorkouts() {
            //creates example workouts
            let workout1exercises = [];
            let workout2exercises = [];

            for (let i = 0; i < 9; i++) {
                if (i <= 5) {
                    workout1exercises.push(this.exercises[i])
                }
                else {
                    workout2exercises.push(this.exercises[i])
                }
            }
            let workout = new Workout("Workout 1", workout1exercises, 5, 10, false);

            let workout2 = new Workout("Workout 2", workout2exercises, 4, 14, false);
            this.workouts.push(workout);
            this.workouts.push(workout2);
            this.selectedWorkout = workout;
        },
        async loadExercises() {
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

        exercisesNotInWorkout() {
            let output = this.exercises.filter(x => this.selectedWorkout.workoutExercises.every(y => y.name !== x.name));
            return output;
        },

        closePopup() {
            // Hide popup and reset data
            this.popup = false;
            this.exercisesInWorkout = [];
            this.workoutname = "";
            this.showExerciseForm = false;
            this.exercise = new Exercise;
            this.newExerciseMuscleGroup = [];

        },
        toggleDescriptions(exercise) {
            if (exercise.showDescription) {
                for (let ex of this.exercises.filter(x => x.showDescription)) {
                    if (ex != exercise){
                        ex.showDescription = false;
                    }
                }
            } 
        }
        ,
        deleteWorkout() {
            const index1 = this.workouts.findIndex((x => x.name === this.selectedWorkout.name));
            const index2 = this.personalWorkouts.findIndex((x => x.name === this.selectedWorkout.name));

            this.workouts.splice(index1, 1);
            this.personalWorkouts.splice(index2, 1);

            this.selectedWorkout = this.workouts[0];
        },
        addToSelectedWorkout(ex) {
            this.selectedWorkout.workoutExercises.push(ex);
        }
        ,
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
        removeExerciseFromWorkout(ex) {
            const index = this.selectedWorkout.workoutExercises.findIndex(x => x.name === ex.name);
            this.selectedWorkout.workoutExercises.splice(index, 1);
        }
        ,
        addWorkout() {
            // Must have atleast one exercise selected to create a workout
            if (this.exercisesInWorkout.length == 0) {
                this.alert = true;
                return;
            }
            let workout = new Workout(this.workoutname, this.exercisesInWorkout, 5, 10, true);
            this.workouts.push(workout);
            this.personalWorkouts = [...this.personalWorkouts, workout];
            this.selectedWorkout = workout;
            this.scrollTop();
            this.closePopup();
        },
        addExercise() {

            this.alertName = false;

            let exercise = new Exercise(this.newExerciseName, this.newExerciseDescription, this.newExerciseMuscleGroup)

            let existingExerciseChecker = this.exercises.findIndex(e => e.name === exercise.name);
            if (existingExerciseChecker !== -1) {
                // An exercise with the same name already exists
                this.alertName = true;
                return;
            }

            this.exercises.push(exercise);
            this.personalExercises = [...this.personalExercises, exercise];

            this.newExerciseName = '';
            this.newExerciseDescription = '';
            this.newExerciseMuscleGroup = [];
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
            } else {
                const preferredDarkmode = window.matchMedia('(prefers-color-scheme: dark)').matches;
                this.darkmode = preferredDarkmode;
            }
        },
        scrollPopup() {
            window.scrollTo({
                top: document.body.scrollHeight - window.innerHeight - 200,
                left: 0,
                behavior: "smooth",
            });
        },
        scrollTop() {
            window.scrollTo({
                top: 0,
                left: 0,
                behavior: "smooth",
            })
        },
        getStoredWorkouts() {
            this.personalExercises = JSON.parse(localStorage.getItem('exercises') || '[]')
            this.personalWorkouts = JSON.parse(localStorage.getItem('workouts') || '[]')

            for (let ex of this.personalExercises) {
                let newEx = new Exercise(ex.name, ex.description, ex.muscleGroups)
                this.exercises.push(newEx)
            }

            for (let workout of this.personalWorkouts) {
                let newWorkout = new Workout(workout.name, workout.workoutExercises, workout.setsPerExercise, workout.repsPerExercise, true);
                this.workouts.push(newWorkout)
            }
        }
    },
    mounted() {

        //No darkmode transition on page load
        setTimeout(() => {
            document.body.classList.remove('no-transition')
        }, 500)

    },
    async beforeMount() {
        this.getDarkModeSettings();
        await this.loadExercises();
        this.createWorkouts();
        this.toggleDarkmode();
        this.getStoredWorkouts();
    }
}).mount("#app")
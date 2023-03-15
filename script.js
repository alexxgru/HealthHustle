class Exercise{
    constructor(name, description, muscleGroups){
        this.name = name;
        this.description = description;
        this.muscleGroups = muscleGroups;

    }
}

class Workout {
    constructor(name,exercises) {
        this.name = name,
        this.Wexercises = exercises;
    }
}

Vue.createApp( {
    data() {
        return {
            selectedWorkout: new Workout("", []),
            exercises: [
            ],
            personalExcersises: [
            ],
            workouts: [
            ] 
        } 
        
    },
    
    methods: {
        createWorkouts(){
            let exercisesToAdd = [];
            for (let i = 0; i < 4; i++) {
                exercisesToAdd.push(this.exercises[i])
            }
            let workout =  new Workout("Workout 1", exercisesToAdd);
            let workout2 = new Workout("Workout 2", [this.exercises[1]]);
            this.workouts.push(workout);
            this.workouts.push(workout2);
            this.selectedWorkout = workout;
        }, 
        async created() {
            return new Promise(async resolve => {
                try{
                    const response = await fetch("exercises.json");
                    const data = await response.json();
        
                    for (let i = 0; i < data.exercises.length; i++) {
                        let ex = new Exercise (data.exercises[i].name, data.exercises[i].description, data.exercises[i].muscleGroups)
                        this.exercises.push(ex);
                    }
                    resolve();
                }
                catch(error){
                    console.error('Error fetching exercises:', error)
                    resolve();
                }
            })
    
        }
    },
    async beforeMount() {
        await this.created();
        this.createWorkouts();
    }
}).mount("#app")
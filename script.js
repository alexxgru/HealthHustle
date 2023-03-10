class Exercise{
    constructor(name, description, muscleGroups){
        this.name = name;
        this.description = description;
        this.muscleGroups = muscleGroups;

    }
}

Vue.CreateApp( {
    data() {
        return {
            exercises: []  
        } 
        
    },
    
    async created() {
        try{
            const response = await fetch(exercises.json);
            const data = await response.json();
            this.exercises = data.map(exercise => new Exercise(exercise.name, exercise.description, exercise.muscleGroups));
        }
        catch(error){
            console.error('Error fetching exercises:', error)
        }

    },

    methods: {

    },
}).mount("#app")
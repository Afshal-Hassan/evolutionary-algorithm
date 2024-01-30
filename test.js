// Define constants
const POPULATION_SIZE = 50;
const MAX_GENERATIONS = 100;
const MUTATION_RATE = 0.1;

// Define boundaries
const lowerBoundaryX = 0.5;
const upperBoundaryX = 7.5;
const lowerBoundaryY = -4.0;
const upperBoundaryY = 2.85;

// Function to generate initial population
function generatePopulation() {
    let population = [];
    for (let i = 0; i < POPULATION_SIZE; i++) {
        let individual = {
            x: Math.random() * (upperBoundaryX - lowerBoundaryX) + lowerBoundaryX,
            y: Math.random() * (upperBoundaryY - lowerBoundaryY) + lowerBoundaryY
        };
        population.push(individual);
    }
    return population;
}

// Fitness function
function evaluateFitness(individual) {
    return 11 * individual.x - 7.59 * individual.y;
}

// Tournament selection
function selectParents(population) {
    let parent1 = population[Math.floor(Math.random() * POPULATION_SIZE)];
    let parent2 = population[Math.floor(Math.random() * POPULATION_SIZE)];
    return [parent1, parent2];
}

// Crossover
function crossover(parent1, parent2) {
    let child = {
        x: (parent1.x + parent2.x) / 2,
        y: (parent1.y + parent2.y) / 2
    };
    return child;
}

// Mutation
function mutate(individual) {
    if (Math.random() < MUTATION_RATE) {
        individual.x = Math.random() * (upperBoundaryX - lowerBoundaryX) + lowerBoundaryX;
    }
    if (Math.random() < MUTATION_RATE) {
        individual.y = Math.random() * (upperBoundaryY - lowerBoundaryY) + lowerBoundaryY;
    }
    return individual;
}

// Evolutionary algorithm with best fitness tracking
function evolutionaryAlgorithm() {
    let population = generatePopulation();
    let generation = 0;
    let bestIndividual = population[0];
    let bestFitness = evaluateFitness(bestIndividual);
    let bestFitnesses = [bestFitness];

    while (generation < MAX_GENERATIONS) {
        let newPopulation = [];

        for (let i = 0; i < POPULATION_SIZE; i++) {
            let [parent1, parent2] = selectParents(population);
            let child = crossover(parent1, parent2);
            child = mutate(child);
            newPopulation.push(child);
        }

        population = newPopulation;

        let generationBestFitness = -Infinity;
        population.forEach((individual) => {
            let fitness = evaluateFitness(individual);
            if (fitness > bestFitness) {
                bestIndividual = individual;
                bestFitness = fitness;
            }
            if (fitness > generationBestFitness) {
                generationBestFitness = fitness;
            }
        });

        bestFitnesses.push(generationBestFitness);

        generation++;
    }

    return { bestIndividual, bestFitness, bestFitnesses };
}

// Run the algorithm
let { bestIndividual, bestFitness, bestFitnesses } = evolutionaryAlgorithm();
console.log("Best solution:", bestIndividual);
console.log("Fitness:", bestFitness);

// Print best fitness of every generation
console.log("Best fitness of each generation:");
bestFitnesses.forEach((fitness, generation) => {
    console.log(`Generation ${generation}: ${fitness}`);
});


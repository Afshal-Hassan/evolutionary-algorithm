class EvolutionaryAlgorithm {
    constructor() {
        this.stepSize = 0.15;
        this.noOfChildsToBeGenerated = 10;
        this.noOfIndividualsToBeSelected = 10;
        this.individuals = [];
        this.newIndividuals = [];
        this.selectedIndividuals = [];
        this.fittestIndividualsOfEachGeneration = [];
        this.avgFitnesstOfEachGeneration = [];
        // Que 2
        this.xUpperBound = 20;
        this.yUpperBound = 25;
        this.xLowerBound = -15;
        this.yLowerBound = -20;
    }

    runAlgo() {
        this.initializeIndividuals();
        this.sortIndividuals(this.individuals);
        console.log("Starting gen: ", this.individuals);
        this.fittestIndividualsOfEachGeneration.push(this.individuals[0]);
        this.avgFitnesstOfEachGeneration.push(this.calculateAverage(this.individuals));

        while (true) {
            while (this.newIndividuals.length < this.noOfChildsToBeGenerated) {
                const individual1 = this.individuals[this.generateRandomIndexForSelectingIndividual()];
                const indexForSecondParent = this.generateRandomIndexForSelectingIndividual();
                let individual2 = this.individuals[indexForSecondParent];
                if (individual1 === individual2) individual2 = this.individuals[(indexForSecondParent + 1) % 10];
                this.reproduceOneChild(individual1, individual2);
            }

            const parentAndChildren = [...this.individuals, ...this.newIndividuals];
            this.sortIndividuals(parentAndChildren);
            this.selectedIndividuals = parentAndChildren.slice(0, this.noOfIndividualsToBeSelected);
            this.fittestIndividualsOfEachGeneration.push(this.selectedIndividuals[0]);
            this.avgFitnesstOfEachGeneration.push(this.calculateAverage(this.selectedIndividuals));

            if (this.avgFitnesstOfEachGeneration.length >= 10 && this.isStoppingCriteria2Satisfied()) {
                console.log("Criteria Satisfied");
                break;
            }

            this.individuals = this.selectedIndividuals;
            this.newIndividuals = [];
        }

        console.log("Fittest indv of each gen ", this.fittestIndividualsOfEachGeneration);
        console.log("Avg fitness of each gen ", this.avgFitnesstOfEachGeneration);

        // Write to file if needed
    }

    initializeIndividuals() {
        for (let i = 0; i < this.noOfIndividualsToBeSelected; i++) {
            this.individuals.push(this.initializeIndividual());
        }
    }

    initializeIndividual() {
        const x = Math.random() * (this.xUpperBound - this.xLowerBound) + this.xLowerBound;
        const y = Math.random() * (this.yUpperBound - this.yLowerBound) + this.yLowerBound;
        const fitness = this.calculateFitness(x, y);
        return { x, y, fitness };
    }

    generateRandomIndexForSelectingIndividual() {
        return Math.floor(Math.random() * 10);
    }

    reproduceOneChild(individual1, individual2) {
        const newChild = this.doCrossOverOneChild(individual1, individual2);
        const randomValue = this.allowMutationBasedOnRandomNumber();
        if (randomValue !== -1) {
            this.doMutation(randomValue, newChild);
        }
        this.newIndividuals.push(newChild);
    }

    doCrossOverOneChild(individual1, individual2) {
        const newChildX = (individual1.x + individual2.x) / 2;
        const newChildY = (individual1.y + individual2.y) / 2;
        const fitness = this.calculateFitness(newChildX, newChildY);
        return { x: individual1.x, y: individual2.y, fitness };
    }

    allowMutationBasedOnRandomNumber() {
        const randomNumber = Math.floor(Math.random() * 400) + 1;
        if (randomNumber >= 1 && randomNumber <= 100) return randomNumber;
        else return -1;
    }

    doMutation(randomValue, individual) {
        if (randomValue > 50) { // mutate x
            if (randomValue % 2 === 0) {
                individual.x += this.stepSize;
                individual.x = this.reSetBoundary(individual.x, this.xLowerBound, this.xUpperBound);
            } else {
                individual.x -= this.stepSize;
                individual.x = this.reSetBoundary(individual.x, this.xLowerBound, this.xUpperBound);
            }
        } else { // mutate y
            if (randomValue % 2 === 0) {
                individual.y += this.stepSize;
                individual.y = this.reSetBoundary(individual.y, this.yLowerBound, this.yUpperBound);
            } else {
                individual.y -= this.stepSize;
                individual.y = this.reSetBoundary(individual.y, this.yLowerBound, this.yUpperBound);
            }
        }
    }

    reSetBoundary(elementToBeChecked, lowerBoundary, upperBoundary) {
        if (elementToBeChecked < lowerBoundary) return lowerBoundary;
        if (elementToBeChecked > upperBoundary) return upperBoundary;
        return elementToBeChecked;
    }

    calculateFitness(x, y) {
        return -7 * (x ** 2) + 3 * x * Math.sin(y) - 786 * y + 989;
    }

    calculateAverage(individuals) {
        const sumOfIndividualsFitness = individuals.reduce((acc, individual) => acc + individual.fitness, 0);
        return sumOfIndividualsFitness / individuals.length;
    }

    isStoppingCriteria2Satisfied() {
        const startIndex = this.avgFitnesstOfEachGeneration.length - 10;
        for (let i = startIndex; i < this.avgFitnesstOfEachGeneration.length - 2; i++) {
            if (Math.abs(this.avgFitnesstOfEachGeneration[i] - this.avgFitnesstOfEachGeneration[i + 1]) > 0.001) return false;
        }
        return true;
    }

    sortIndividuals(individuals) {
        individuals.sort((a, b) => b.fitness - a.fitness);
    }
}

const evolutionaryAlgorithm = new EvolutionaryAlgorithm();
evolutionaryAlgorithm.runAlgo();

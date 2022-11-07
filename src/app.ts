// Given the digits 0 through 9 and the operators +, -, * and /,  find a sequence that will represent a given target number. The operators will be applied sequentially from left to right as you read.

// TYPES
type Bit = number
type Gene = Bit[]
export type Chromosome = Gene[]
export type Population = Chromosome[]
type Fitness = {chromosome: Chromosome; fitnessScore: number}
export type PopulationFitness = Fitness[]
export type RouletteWheel = {
	chromosome: Chromosome
	start: number
	end: number
}[]
export type Couple = {
	chromosome1: Chromosome
	chromosome2: Chromosome
}

const translation: {[index: string]: string} = {
	'0000': '0',
	'0001': '1',
	'0010': '2',
	'0011': '3',
	'0100': '4',
	'0101': '5',
	'0110': '6',
	'0111': '7',
	'1000': '8',
	'1001': '9',
	'1010': '+',
	'1011': '-',
	'1100': '*',
	'1101': '/',
}

export const createPopulation = (
	popSize: number,
	chromSize: number
): Population => {
	return Array.apply(null, Array(popSize)).map(() => {
		const chrom = createChromosome(chromSize)
		return chrom
	}) as Population
}

export const createChromosome = (size: number): Chromosome => {
	return Array.apply(null, Array(size)).map(() => createGene()) as Chromosome
}

export const createGene = (): Gene => {
	return Array.apply(null, Array(geneSize)).map(() => createBit()) as Gene
}

export const createBit = (num = 2): Bit => {
	return num >= 2 ? (Math.floor(Math.random() * 2) as Bit) : (num as Bit)
}

export const checkFitnessScore = (chromosome: Chromosome): number => {
	const decodedChromosome = chromosome.map((gene: Gene) => {
		return decode(gene)
	})
	const cleanupChromosome: string[] = cleanup(decodedChromosome)
	const result = calculateEq(cleanupChromosome)
	const denominator = goal - result < 0 ? result - goal : goal - result
	if (denominator === 0) {
		return highNum
	} else {
		return 1 / denominator
	}
}

export const groupFitnessScore = (
	population: Population
): PopulationFitness => {
	return population.map((chrom: Chromosome) => {
		const fitness = checkFitnessScore(chrom)
		return {chromosome: chrom, fitnessScore: fitness}
	})
}

export const checkWinnerFitnessScore = (
	population: PopulationFitness
): Fitness => {
	return population.reduce((acc, item: Fitness) => {
		if (item.fitnessScore > acc.fitnessScore) {
			acc = {
				chromosome: item.chromosome,
				fitnessScore: item.fitnessScore,
			} as Fitness
		}
		return acc
	})
}

export const decode = (gene: Gene): string => {
	const stringGene = gene
		.map((bit) => String(bit))
		.reduce((pv, cv) => pv.concat(cv))
	return translation[stringGene]
}

export const cleanup = (equation: string[]): string[] => {
	const numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
	const symbols = ['+', '-', '*', '/']
	const initialValue: {valueTrack: string; equation: string[]} = {
		valueTrack: 'number',
		equation: [],
	}
	const cleanedEq = equation.reduce(
		(
			acc: {valueTrack: string; equation: string[]},
			current: string
		): {valueTrack: string; equation: string[]} => {
			if (acc.valueTrack === 'number' && numbers.includes(current)) {
				return {
					valueTrack: 'symbol',
					equation: [...acc.equation, current],
				}
			} else if (
				acc.valueTrack === 'symbol' &&
				symbols.includes(current)
			) {
				return {
					valueTrack: 'number',
					equation: [...acc.equation, current],
				}
			} else {
				return acc
			}
		},
		initialValue
	).equation

	return symbols.includes(cleanedEq[cleanedEq.length - 1])
		? cleanedEq.slice(0, -1)
		: cleanedEq
}

export const calculateEq = (equation: string[]): number => {
	const firstOp = ['*', '/']
	const secondOp = ['+', '-']
	if (equation.length === 0) return 0
	if (equation.length === 1) {
		if (firstOp.includes(equation[0])) return 0
		else if (secondOp.includes(equation[0])) return 0
		else return Number(equation[0])
	}
	if (equation.length === 2) {
		return Number(equation[0])
	}
	const firstResult = equation.reduce(
		(acc: string[], current: string): string[] => {
			if (firstOp.includes(current)) {
				if (acc.indexOf('*') > -1) {
					const index = acc.indexOf('*')
					const firstNum = acc[index - 1]
					const secondNum = acc[index + 1]
					const x = String(Number(firstNum) * Number(secondNum))
					const startEq = acc.slice(0, index - 1)
					const endEq = acc.slice(index + 2)
					return [...startEq, x, ...endEq]
				} else {
					const index = acc.indexOf('/')
					const firstNum = acc[index - 1]
					const secondNum = acc[index + 1]
					const x =
						Number(secondNum) === 0
							? '0'
							: String(Number(firstNum) / Number(secondNum))
					const startEq = acc.slice(0, index - 1)
					const endEq = acc.slice(index + 2)
					return [...startEq, x, ...endEq]
				}
			} else {
				return acc
			}
		},
		equation
	)
	const secondResult = firstResult.reduce(
		(acc: string[], current: string): string[] => {
			if (secondOp.includes(current)) {
				if (acc.indexOf('+') > -1) {
					const index = acc.indexOf('+')
					const firstNum = acc[index - 1]
					const secondNum = acc[index + 1]
					const x = String(Number(firstNum) + Number(secondNum))
					const startEq = acc.slice(0, index - 1)
					const endEq = acc.slice(index + 2)
					return [...startEq, x, ...endEq]
				} else {
					const index = acc.indexOf('-')
					const firstNum = acc[index - 1]
					const secondNum = acc[index + 1]
					const x = String(Number(firstNum) - Number(secondNum))
					const startEq = acc.slice(0, index - 1)
					const endEq = acc.slice(index + 2)
					return [...startEq, x, ...endEq]
				}
			} else {
				return acc
			}
		},
		firstResult
	)
	return Number(secondResult[0])
}

export const makeRouletteWheel = (
	popfitness: PopulationFitness
): RouletteWheel => {
	var positionStart = 0
	const simpleRoulette = popfitness.map((fitness: Fitness) => {
		const positionEnd = positionStart + fitness.fitnessScore
		const piece = {
			chromosome: fitness.chromosome,
			start: positionStart,
			end: positionEnd,
		}
		positionStart = positionEnd
		return piece
	})
	const proportionalRoulette = simpleRoulette.map((fitness) => {
		const start = (100 * fitness.start) / positionStart
		const end =
			(100 * fitness.end) / positionStart > 100
				? 100
				: (100 * fitness.end) / positionStart
		const piece = {
			chromosome: fitness.chromosome,
			start: start,
			end: end,
		}
		return piece
	})

	return proportionalRoulette
}

export const chooseCouple = (roulette: RouletteWheel): Couple => {
	const firstNum = Math.floor(Math.random() * 100)
	const firstChrom = roulette.filter((chrom) => {
		return chrom.start <= firstNum && chrom.end > firstNum
	})[0]

	const secondNum = Math.floor(Math.random() * 100)
	const secondChrom = roulette.filter((chrom) => {
		return chrom.start <= secondNum && chrom.end > secondNum
	})[0]

	if (firstChrom === secondChrom) {
		return chooseCouple(roulette)
	} else {
		return {
			chromosome1: firstChrom.chromosome,
			chromosome2: secondChrom.chromosome,
		}
	}
}

export const checkCrossOver = () => {
	const chance = Math.random()
	return chance < crossOverRate ? true : false
}

export const checkMutation = () => {
	const chance = Math.random()
	return chance < mutationRate ? true : false
}

export const divideChromChunks = (binChrom: number[]): Gene[] => {
	const result = binChrom.reduce((resultArray: Gene[], number, index) => {
		const chunkIndex = Math.floor(index / geneSize)

		if (!resultArray[chunkIndex]) {
			resultArray[chunkIndex] = [] // start a new chunk
		}

		const bit = createBit(number)
		resultArray[chunkIndex].push(bit)

		return resultArray
	}, [])

	return result
}

export const mutateChromosomes = (chromosomeBin: number[]): number[] => {
	return chromosomeBin.map((number) => {
		if (checkMutation()) {
			// console.log('--> MUTATION HAPPENED')
			if (number === 1) {
				return 0
			} else {
				return 1
			}
		} else {
			return number
		}
	})
}

export const crossOver = (couple: Couple): Couple => {
	const firstParent = couple.chromosome1.flat()
	const secondParent = couple.chromosome2.flat()
	const whereToSwap = Math.floor(Math.random() * chromosomeSize * 4)

	const firstChromBin = firstParent
		.slice(0, whereToSwap)
		.concat(secondParent.slice(whereToSwap))

	const secondChromBin = secondParent
		.slice(0, whereToSwap)
		.concat(firstParent.slice(whereToSwap))

	const mutatedFirstChromBin = mutateChromosomes(firstChromBin)
	const mutatedSecondChromBin = mutateChromosomes(secondChromBin)
	const mutatedFirstChrom = divideChromChunks(mutatedFirstChromBin)
	const mutatedSecondChrom = divideChromChunks(mutatedSecondChromBin)
	return {
		chromosome1: mutatedFirstChrom,
		chromosome2: mutatedSecondChrom,
	}
}

const chromosomeSize = 20
const populationSize = 200
const numberOfGenerations = 20
export const highNum = 10 ** 6
const geneSize = 4
const goal = 43
const crossOverRate = 0.7
const mutationRate = 0.001
const initialPopulation: Population = createPopulation(
	populationSize,
	chromosomeSize
)

const gameLoop = (population: Population, iteration: number): Fitness => {
	console.log('Iteration: ', iteration)
	const genFitnessScore = groupFitnessScore(population)
	const bestFitness = checkWinnerFitnessScore(genFitnessScore)
	if (bestFitness.fitnessScore === highNum) {
		console.log('THE END! PERFECT FITNESS FOUND!!')
		const decodedWinner = bestFitness.chromosome.map((gene) => decode(gene))
		const cleanedWinner = cleanup(decodedWinner)
		const result = calculateEq(cleanedWinner)
		console.log('Winner: ', cleanedWinner)
		console.log('Winner result: ', result)
		return bestFitness
	} else if (iteration === numberOfGenerations) {
		console.log('THE END! best result found...')
		const decodedWinner = bestFitness.chromosome.map((gene) => decode(gene))
		const cleanedWinner = cleanup(decodedWinner)
		const result = calculateEq(cleanedWinner)
		console.log('Winner: ', cleanedWinner)
		console.log('Winner result: ', result)
		return bestFitness
	}
	const roulette = makeRouletteWheel(genFitnessScore)

	const newPopulation: Population = roulette.reduce(
		(acc: Chromosome[], item, index) => {
			if (acc.length === populationSize) {
				return acc
			} else {
				const couple = chooseCouple(roulette)
				if (checkCrossOver()) {
					const children = crossOver(couple)
					return [...acc, children.chromosome1, children.chromosome2]
				} else {
					return [...acc, couple.chromosome1, couple.chromosome2]
				}
			}
		},
		[]
	)
	// console.log('newPopulation: ', newPopulation)
	return gameLoop(newPopulation, iteration + 1)
}

console.log('-> gameLoop:', gameLoop(initialPopulation, 1))

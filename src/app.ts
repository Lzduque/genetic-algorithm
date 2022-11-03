// Given the digits 0 through 9 and the operators +, -, * and /,  find a sequence that will represent a given target number. The operators will be applied sequentially from left to right as you read.

// TYPES
type Bit = number
type Gene = Bit[]
type Chromossome = Gene[]
type Population = Chromossome[]
type Fitness = {chromossome: Chromossome; fitnessScore: number}
type PopulationFitness = Fitness[]
type RouletteWheel = {chromossome: Chromossome; start: number; end: number}[]
type Couple = {
	chromossome1: Chromossome
	chromossome2: Chromossome
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

const createPopulation = (popSize: number, chromSize: number): Population => {
	return Array.apply(null, Array(popSize)).map(() => {
		const chrom = createChromossome(chromSize)
		// console.log('chrom: ', chrom)
		return chrom
	}) as Population
}

const createChromossome = (size: number): Chromossome => {
	return Array.apply(null, Array(size)).map(() => createGene()) as Chromossome
}

const createGene = (): Gene => {
	return Array.apply(null, Array(geneSize)).map(() => createBit()) as Gene
}

const createBit = (num = 2): Bit => {
	return num >= 2 ? (Math.floor(Math.random() * 2) as Bit) : (num as Bit)
}

const checkFitnessScore = (chromossome: Chromossome): number => {
	const decodedChromossome = chromossome.map((gene: Gene) => {
		return decode(gene)
	})
	// console.log('decodedChromossome: ', decodedChromossome)
	const cleanupChromossome: string[] = cleanup(decodedChromossome)
	// console.log('cleanupChromossome: ', cleanupChromossome)
	const result = calculateEq(cleanupChromossome)
	// console.log('result: ', result)
	const denominator = goal - result < 0 ? result - goal : goal - result
	return 1 / denominator
}

const groupFitnessScore = (population: Population): PopulationFitness => {
	return population.map((chrom: Chromossome) => {
		const fitness = checkFitnessScore(chrom)
		if (fitness === 1) {
			console.log('PERFECT RESULT FOUND')
			return {chromossome: chrom, fitnessScore: fitness}
		}
		return {chromossome: chrom, fitnessScore: fitness}
	})
}

const checkWinnerFitnessScore = (population: PopulationFitness): Fitness => {
	return population.reduce((acc, item: Fitness) => {
		if (item.fitnessScore > acc.fitnessScore) {
			acc = {
				chromossome: item.chromossome,
				fitnessScore: item.fitnessScore,
			} as Fitness
		}
		if (item.fitnessScore === 1) {
			console.log('PERFECT RESULT FOUND')
		}
		return acc
	})
}

const decode = (gene: Gene): string => {
	const stringGene = gene
		.map((bit) => String(bit))
		.reduce((pv, cv) => pv.concat(cv))
	return translation[stringGene]
}

const cleanup = (equation: string[]): string[] => {
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

	// console.log('cleanedEq: ', cleanedEq)
	return symbols.includes(cleanedEq[cleanedEq.length - 1])
		? cleanedEq.slice(0, -1)
		: cleanedEq
}

const calculateEq = (equation: string[]): number => {
	const firstOp = ['*', '/']
	const secondOp = ['+', '-']
	if (equation.length <= 1) {
		// console.log('Equation is short')
		return Number(equation[0])
	}
	const firstResult = equation.reduce(
		(acc: string[], current: string): string[] => {
			if (firstOp.includes(current)) {
				// console.log('acc: ', acc)
				// console.log('current: ', current)
				if (acc.indexOf('*') > -1) {
					// console.log('--> multiplication')
					const index = acc.indexOf('*')
					const firstNum = acc[index - 1]
					const secondNum = acc[index + 1]
					// console.log('-> firstNum: ', firstNum)
					// console.log('-> secondNum: ', secondNum)
					const x = String(Number(firstNum) * Number(secondNum))
					const startEq = acc.slice(0, index - 1)
					const endEq = acc.slice(index + 2)
					// console.log('--> x: ', x)
					// console.log('--> startEq: ', startEq)
					// console.log('--> endEq: ', endEq)
					// console.log('--> [...startEq, x, ...endEq]: ', [
					// 	...startEq,
					// 	x,
					// 	...endEq,
					// ])
					return [...startEq, x, ...endEq]
				} else {
					// console.log('--> division')
					const index = acc.indexOf('/')
					const firstNum = acc[index - 1]
					const secondNum = acc[index + 1]
					// console.log('-> firstNum: ', firstNum)
					// console.log('-> secondNum: ', secondNum)
					const x = String(Number(firstNum) / Number(secondNum))
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
	// console.log('firstResult: ', firstResult)
	const secondResult = firstResult.reduce(
		(acc: string[], current: string): string[] => {
			if (secondOp.includes(current)) {
				// console.log('acc: ', acc)
				// console.log('current: ', current)
				if (acc.indexOf('+') > -1) {
					// console.log('--> addition')
					const index = acc.indexOf('+')
					const firstNum = acc[index - 1]
					const secondNum = acc[index + 1]
					// console.log('-> firstNum: ', firstNum)
					// console.log('-> secondNum: ', secondNum)
					const x = String(Number(firstNum) + Number(secondNum))
					const startEq = acc.slice(0, index - 1)
					const endEq = acc.slice(index + 2)
					// console.log('--> x: ', x)
					// console.log('--> startEq: ', startEq)
					// console.log('--> endEq: ', endEq)
					// console.log('--> [...startEq, x, ...endEq]: ', [
					// 	...startEq,
					// 	x,
					// 	...endEq,
					// ])
					return [...startEq, x, ...endEq]
				} else {
					// console.log('--> subtraction')
					const index = acc.indexOf('-')
					const firstNum = acc[index - 1]
					const secondNum = acc[index + 1]
					// console.log('-> firstNum: ', firstNum)
					// console.log('-> secondNum: ', secondNum)
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
	// console.log('secondResult: ', secondResult)
	// console.log('result: ', Number(secondResult[0]))
	return Number(secondResult[0])
}

const makeRouletteWheel = (popfitness: PopulationFitness): RouletteWheel => {
	var positionStart = 0
	const simpleRoulette = popfitness.map((fitness: Fitness) => {
		const positionEnd = positionStart + fitness.fitnessScore
		const piece = {
			chromossome: fitness.chromossome,
			start: positionStart,
			end: positionEnd,
		}
		positionStart = positionEnd
		return piece
	})
	const proportionalRoulette = simpleRoulette.map((fitness) => {
		const start = (100 * fitness.start) / positionStart
		const end = (100 * fitness.end) / positionStart
		const piece = {
			chromossome: fitness.chromossome,
			start: start,
			end: end,
		}
		console.log('start: ', start)
		console.log('end: ', end)
		return piece
	})

	return proportionalRoulette
}

const chooseCouple = (roulette: RouletteWheel): Couple => {
	const firstNum = Math.floor(Math.random() * 100)
	const firstChrom = roulette.filter(
		(chrom) => chrom.start < firstNum && chrom.end > firstNum
	)[0]

	const secondNum = Math.floor(Math.random() * 100)
	const secondChrom = roulette.filter(
		(chrom) => chrom.start < secondNum && chrom.end > secondNum
	)[0]
	if (firstChrom === secondChrom) {
		console.log('----------> SAME CHROMOSSOME PICKED!!!')
		return chooseCouple(roulette)
	} else {
		console.log('firstNum: ', firstNum)
		console.log('secondNum: ', secondNum)
		console.log('firstChrom: ', firstChrom)
		console.log('secondChrom: ', secondChrom)

		return {
			chromossome1: firstChrom.chromossome,
			chromossome2: secondChrom.chromossome,
		}
	}
}

const checkCrossOver = () => {
	const chance = Math.random()
	// console.log('Chance: ', chance)
	// console.log('crossOverRate: ', crossOverRate)

	return chance < crossOverRate ? true : false
}

const checkMutation = () => {
	const chance = Math.random()
	// console.log('Chance: ', chance)
	// console.log('mutationRate: ', mutationRate)

	return chance < mutationRate ? true : false
}

const divideChromChunks = (binChrom: number[]): Gene[] => {
	const result = binChrom.reduce((resultArray: Gene[], number, index) => {
		const chunkIndex = Math.floor(index / geneSize)

		if (!resultArray[chunkIndex]) {
			resultArray[chunkIndex] = [] // start a new chunk
		}

		const bit = createBit(number)
		resultArray[chunkIndex].push(bit)

		return resultArray
	}, [])

	// console.log('result: ', result)
	return result
}

const mutateChromossomes = (chromossomeBin: number[]): number[] => {
	return chromossomeBin.map((number) => {
		if (checkMutation()) {
			console.log('--> MUTATION HAPPENED')
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

const crossOver = (couple: Couple): Population => {
	const firstParent = couple.chromossome1.flat()
	const secondParent = couple.chromossome2.flat()
	const whereToSwap = Math.floor(Math.random() * chromossomeSize * 4)
	console.log('--> whereToSwap: ', whereToSwap)

	const firstChromBin = firstParent
		.slice(0, whereToSwap)
		.concat(secondParent.slice(whereToSwap))

	const secondChromBin = secondParent
		.slice(0, whereToSwap)
		.concat(firstParent.slice(whereToSwap))

	// console.log('firstChromBin: ', firstChromBin)
	// console.log('secondChromBin: ', secondChromBin)

	const mutatedFirstChromBin = mutateChromossomes(firstChromBin)
	const mutatedSecondChromBin = mutateChromossomes(secondChromBin)
	// console.log('mutatedFirstChromBin: ', mutatedFirstChromBin)
	// console.log('mutatedSecondChromBin: ', mutatedSecondChromBin)
	// return new couple, after transforming them back into chromossomes
	const mutatedFirstChrom = divideChromChunks(mutatedFirstChromBin)
	const mutatedSecondChrom = divideChromChunks(mutatedSecondChromBin)
	console.log('mutatedFirstChrom: ', mutatedFirstChrom)
	console.log('mutatedSecondChrom: ', mutatedSecondChrom)
	return [mutatedFirstChrom, mutatedSecondChrom]
}

const chromossomeSize = 10
const populationSize = 6
const geneSize = 4
const goal = 23
const crossOverRate = 0.7
const mutationRate = 0.001
const numberOfGenerations = 5
const initialPopulation: Population = createPopulation(
	populationSize,
	chromossomeSize
)

const gameLoop = () => {
	const genFitnessScore = groupFitnessScore(initialPopulation)
	const bestFitness = checkWinnerFitnessScore(genFitnessScore)
	if (bestFitness.fitnessScore === 1) {
		console.log('THE END! PERFECT FITNESS FOUND!!')
		return bestFitness
	}
	const roulette = makeRouletteWheel(genFitnessScore)

	// const newPopulation: Population = new Array(populationSize)
	const newPopulation: Population = roulette.reduce(
		(acc: Chromossome[], item, index) => {
			if (acc.length === populationSize) {
				return acc
			} else {
				if (checkCrossOver()) {
					const couple = chooseCouple(roulette)
					const children = crossOver(couple)
					return acc.concat(children)
				} else {
					return acc
				}
			}
		},
		[]
	)
	console.log('newPopulation: ', newPopulation)
	// const newPopulation = new Array(populationSize).map((newChrom) => {
	// can't add a couple
	// })
	// const newChromossome = if (chanceForCrossOver) crossOver(couple)
	// return couple

	// it should return the best fit OR the perfect fit if it is found before the last generation
}

console.log('-> gameLoop:', gameLoop())

// console.log(
// 	'checkFitnessScore: ',
// 	checkFitnessScore([
// 		[0, 0, 1, 0],
// 		[0, 0, 0, 0],
// 		[1, 1, 0, 0],
// 		[0, 1, 0, 0],
// 		[0, 0, 0, 0],
// 		[0, 0, 0, 0],
// 		[1, 0, 1, 0],
// 		[1, 1, 1, 1],
// 		[1, 1, 1, 0],
// 		[1, 1, 1, 1],
// 		[1, 0, 1, 0],
// 		[1, 0, 0, 1],
// 	] as unknown as Chromossome)
// )

// console.log(
// 	'checkFitnessScore: ',
// 	checkFitnessScore([
//     [ 1, 0, 1, 1 ],
//     [ 0, 0, 0, 0 ],
//     [ 1, 0, 0, 1 ],
//     [ 1, 0, 1, 0 ],
//     [ 1, 0, 1, 0 ],
//     [ 1, 0, 1, 1 ],
//     [ 0, 1, 1, 0 ],
//     [ 1, 1, 0, 0 ],
//     [ 0, 1, 0, 0 ],
//     [ 1, 1, 1, 1 ]
//   ] as unknown as Chromossome)
// )

// console.log(
// 	"calculateEq ['2', '*', '4', '+', '6', '*', '9']: ",
// 	calculateEq(['2', '*', '4', '+', '6', '*', '9'])
// )
// console.log("calculateEq ['6', '*', '8']: ", calculateEq(['6', '*', '8']))
// console.log('createPopulation(5, 10): ', createPopulation(5, 10))

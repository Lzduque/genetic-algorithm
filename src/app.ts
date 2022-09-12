// Given the digits 0 through 9 and the operators +, -, * and /,  find a sequence that will represent a given target number. The operators will be applied sequentially from left to right as you read.

// TYPES
type Bit = number
type Gene = Bit[]
type Chromossome = Gene[]
type Population = Chromossome[]
type Fitness = {chromossome: Chromossome; fitnessScore: number}
type PopulationFitness = Fitness[]

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
	return Array.apply(null, Array(4)).map(() => createBit()) as Gene
}

const createBit = (): Bit => {
	return Math.floor(Math.random() * 2) as Bit
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
	return 1 / (goal - result)
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

const chromossomeSize = 10
const populationSize = 5
const goal = 23
const initialPopulation: Population = createPopulation(
	populationSize,
	chromossomeSize
)

const gameLoop = () => {
	const firstGenFitnessScore = groupFitnessScore(initialPopulation)

	return firstGenFitnessScore
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
// 	"calculateEq ['2', '*', '4', '+', '6', '*', '9']: ",
// 	calculateEq(['2', '*', '4', '+', '6', '*', '9'])
// )
// console.log("calculateEq ['6', '*', '8']: ", calculateEq(['6', '*', '8']))
// console.log('createPopulation(5, 10): ', createPopulation(5, 10))

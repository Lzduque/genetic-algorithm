// Given the digits 0 through 9 and the operators +, -, * and /,  find a sequence that will represent a given target number. The operators will be applied sequentially from left to right as you read.

type Bit = number
type Gene = Bit[]
type Chromossome = Gene[]
type Population = Chromossome[]

console.log('Hello')

// FIRST Generate a number of random chromossomes = population

const createPopulation = (popSize: number, chromSize: number): Population => {
	return Array.apply(null, Array(popSize)).map(() =>
		createChromossome(chromSize)
	) as Population
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

const initialPopulation: Population = createPopulation(5, 10)

// :number ??
const checkFitnessScore = (chromossome: Chromossome) => {
	const decodedChromossome = chromossome.map((gene: Gene) => {
		return decode(gene)
	})
	const cleanupChromossome: string[] = cleanup(decodedChromossome)
	return cleanupChromossome
}

const decode = (gene: Gene): string => {
	const stringGene = gene
		.map((bit) => String(bit))
		.reduce((pv, cv) => pv.concat(cv))
	return translation[stringGene]
}

const cleanup = (equation: string[]) => {
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

const calculate = (equation: string[]) => {
	const firstOp = ['*', '/']
	const secondOp = ['+', '-']
	const initialValue: {valueTrack: string; equation: string[]} = {
		valueTrack: 'firstOp',
		equation: [''],
	}
	const result = equation.reduce(
		(
			acc: {valueTrack: string; equation: string[]},
			current: string
		): {valueTrack: string; equation: string[]} => {
			if (acc.valueTrack === 'firstOp' && firstOp.includes(current)) {
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
	return equation
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

console.log(
	'checkFitnessScore: ',
	checkFitnessScore([
		[0, 0, 1, 0],
		[0, 0, 0, 0],
		[1, 1, 0, 0],
		[0, 0, 1, 1],
		[0, 0, 0, 0],
		[0, 0, 0, 0],
		[1, 0, 1, 0],
		[1, 1, 1, 1],
		[1, 1, 1, 0],
		[1, 1, 1, 1],
	] as unknown as Chromossome)
)
console.log('calculate: ', calculate(['2', '*', '3']))
// console.log('createPopulation(5, 10): ', createPopulation(5, 10))

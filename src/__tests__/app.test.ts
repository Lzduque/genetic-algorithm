import {describe, expect, test} from '@jest/globals'
import {
	createPopulation,
	Chromosome,
	createChromosome,
	createGene,
	createBit,
	checkFitnessScore,
	highNum,
	groupFitnessScore,
	Population,
	checkWinnerFitnessScore,
	PopulationFitness,
	decode,
	cleanup,
	calculateEq,
	makeRouletteWheel,
	chooseCouple,
	RouletteWheel,
	checkCrossOver,
	checkMutation,
	divideChromChunks,
	mutateChromosomes,
	crossOver,
	Couple,
} from '../app'

test('create a chromosome population', () => {
	const popSize = 10
	const chromSize = 15
	const population = createPopulation(popSize, chromSize)
	expect(population.length).toBe(popSize)
	population.forEach((chrom: Chromosome) => {
		expect(chrom.length).toBe(chromSize)
	})
})

test('create a chromosome', () => {
	const size = 10
	const chromosome = createChromosome(size)
	expect(chromosome.length).toBe(size)
})

test('create a gene', () => {
	const gene = createGene()
	expect(gene.length).toBe(4)
})

test('create a bit', () => {
	const bit = createBit()
	expect(bit).toBeLessThan(2)
	expect(bit).toBeGreaterThanOrEqual(0)
})

test('check fitness score for a perfect match', () => {
	const chrom = [
		[0, 0, 0, 1],
		[0, 1, 1, 0],
		[0, 0, 1, 0],
		[1, 1, 1, 1],
		[1, 1, 0, 0],
		[0, 1, 1, 0],
		[0, 0, 0, 0],
		[0, 0, 0, 0],
		[1, 1, 0, 0],
		[1, 0, 1, 0],
		[0, 1, 0, 1],
		[1, 0, 1, 0],
		[1, 1, 0, 0],
		[0, 1, 0, 1],
		[0, 0, 0, 1],
		[0, 1, 1, 1],
		[1, 0, 1, 0],
		[1, 0, 1, 1],
		[1, 0, 0, 0],
		[0, 1, 0, 1],
	] as unknown as Chromosome
	const fitness = checkFitnessScore(chrom)
	expect(fitness).not.toBeFalsy()
	expect(fitness).toEqual(highNum)
})

test('check group fitness score', () => {
	const pop = [
		[
			[0, 0, 0, 1],
			[0, 1, 1, 0],
			[0, 0, 1, 0],
			[1, 1, 1, 1],
			[1, 1, 0, 0],
			[0, 1, 1, 0],
			[0, 0, 0, 0],
			[0, 0, 0, 0],
			[1, 1, 0, 0],
			[1, 0, 1, 0],
			[0, 1, 0, 1],
			[1, 0, 1, 0],
			[1, 1, 0, 0],
			[0, 1, 0, 1],
			[0, 0, 0, 1],
			[0, 1, 1, 1],
			[1, 0, 1, 0],
			[1, 0, 1, 1],
			[1, 0, 0, 0],
			[0, 1, 0, 1],
		],
		[
			[0, 1, 0, 1],
			[0, 0, 1, 1],
			[1, 1, 0, 0],
			[1, 1, 1, 0],
			[0, 1, 1, 0],
			[1, 1, 0, 1],
			[0, 0, 1, 1],
			[1, 0, 1, 0],
			[0, 0, 0, 1],
			[0, 0, 0, 1],
			[1, 0, 0, 0],
			[0, 1, 0, 0],
			[1, 0, 1, 0],
			[1, 0, 0, 0],
			[0, 1, 0, 0],
			[0, 1, 0, 1],
			[0, 0, 0, 1],
			[1, 0, 0, 0],
			[1, 1, 0, 0],
			[0, 1, 0, 0],
		],
		[
			[1, 0, 1, 0],
			[1, 1, 1, 1],
			[0, 1, 1, 0],
			[0, 0, 0, 1],
			[0, 1, 1, 0],
			[1, 1, 0, 0],
			[0, 1, 1, 0],
			[0, 1, 0, 0],
			[0, 0, 0, 1],
			[0, 0, 0, 0],
			[0, 1, 1, 0],
			[0, 0, 0, 1],
			[0, 0, 1, 0],
			[0, 0, 0, 0],
			[0, 0, 0, 1],
			[0, 0, 0, 0],
			[1, 0, 1, 0],
			[0, 1, 1, 1],
			[0, 0, 0, 0],
			[0, 1, 0, 1],
		],
	] as unknown as Population
	const groupFitness = groupFitnessScore(pop)
	expect(groupFitness).not.toBe([])
	expect(groupFitness.length).toBe(3)
	expect(groupFitness[0]).toStrictEqual({
		chromosome: [
			[0, 0, 0, 1],
			[0, 1, 1, 0],
			[0, 0, 1, 0],
			[1, 1, 1, 1],
			[1, 1, 0, 0],
			[0, 1, 1, 0],
			[0, 0, 0, 0],
			[0, 0, 0, 0],
			[1, 1, 0, 0],
			[1, 0, 1, 0],
			[0, 1, 0, 1],
			[1, 0, 1, 0],
			[1, 1, 0, 0],
			[0, 1, 0, 1],
			[0, 0, 0, 1],
			[0, 1, 1, 1],
			[1, 0, 1, 0],
			[1, 0, 1, 1],
			[1, 0, 0, 0],
			[0, 1, 0, 1],
		],
		fitnessScore: 1000000,
	})
})

test('check winner fitness score', () => {
	const popFitness = [
		{
			chromosome: [
				[0, 0, 0, 1],
				[0, 1, 1, 0],
				[0, 0, 1, 0],
				[1, 1, 1, 1],
				[1, 1, 0, 0],
				[0, 1, 1, 0],
				[0, 0, 0, 0],
				[0, 0, 0, 0],
				[1, 1, 0, 0],
				[1, 0, 1, 0],
				[0, 1, 0, 1],
				[1, 0, 1, 0],
				[1, 1, 1, 0],
				[0, 1, 0, 1],
				[0, 0, 0, 1],
				[0, 1, 1, 1],
				[1, 1, 1, 0],
				[1, 0, 1, 1],
				[1, 0, 0, 0],
				[0, 1, 0, 1],
			],
			fitnessScore: 0.0625,
		},
		{
			chromosome: [
				[0, 1, 0, 1],
				[0, 0, 1, 1],
				[1, 1, 0, 0],
				[1, 1, 1, 0],
				[0, 1, 1, 0],
				[1, 1, 0, 1],
				[1, 1, 1, 1],
				[1, 0, 1, 0],
				[0, 0, 0, 1],
				[0, 0, 0, 1],
				[1, 0, 1, 0],
				[0, 1, 0, 0],
				[1, 0, 1, 0],
				[1, 0, 0, 0],
				[0, 1, 0, 0],
				[0, 1, 0, 1],
				[0, 0, 0, 1],
				[1, 0, 0, 0],
				[1, 1, 1, 0],
				[0, 1, 0, 0],
			],
			fitnessScore: 1,
		},
		{
			chromosome: [
				[1, 0, 1, 0],
				[1, 1, 1, 1],
				[0, 1, 1, 0],
				[0, 0, 0, 1],
				[0, 1, 1, 0],
				[1, 1, 0, 0],
				[0, 1, 1, 0],
				[0, 1, 0, 0],
				[0, 0, 0, 1],
				[0, 0, 0, 0],
				[0, 1, 1, 0],
				[0, 0, 0, 1],
				[0, 0, 1, 0],
				[0, 0, 0, 0],
				[0, 0, 0, 1],
				[0, 0, 0, 0],
				[1, 0, 1, 0],
				[0, 1, 1, 1],
				[0, 0, 0, 0],
				[0, 1, 0, 1],
			],
			fitnessScore: 1000000,
		},
	] as unknown as PopulationFitness
	const winner = checkWinnerFitnessScore(popFitness)
	expect(winner).not.toBe([])
	expect(winner).toStrictEqual({
		chromosome: [
			[1, 0, 1, 0],
			[1, 1, 1, 1],
			[0, 1, 1, 0],
			[0, 0, 0, 1],
			[0, 1, 1, 0],
			[1, 1, 0, 0],
			[0, 1, 1, 0],
			[0, 1, 0, 0],
			[0, 0, 0, 1],
			[0, 0, 0, 0],
			[0, 1, 1, 0],
			[0, 0, 0, 1],
			[0, 0, 1, 0],
			[0, 0, 0, 0],
			[0, 0, 0, 1],
			[0, 0, 0, 0],
			[1, 0, 1, 0],
			[0, 1, 1, 1],
			[0, 0, 0, 0],
			[0, 1, 0, 1],
		],
		fitnessScore: 1000000,
	})
})

test('check decoding genes', () => {
	const gene1 = [1, 0, 1, 0]
	const gene2 = [1, 1, 1, 1]
	const gene3 = [0, 1, 1, 0]
	const gene4 = [1, 1, 1, 0]
	const decodeGene1 = decode(gene1)
	const decodeGene2 = decode(gene2)
	const decodeGene3 = decode(gene3)
	const decodeGene4 = decode(gene4)
	expect(decodeGene1).toBe('+')
	expect(decodeGene2).toBe(undefined)
	expect(decodeGene3).toBe('6')
	expect(decodeGene4).toBe(undefined)
})

test('check cleaning up equations', () => {
	const decodedChrom1 = [
		'+',
		undefined,
		'6',
		'1',
		'6',
		'*',
		'6',
		'4',
		'1',
		'0',
		'6',
		'1',
		'2',
		'0',
		'1',
		'0',
		'+',
		'7',
		'0',
		'5',
	] as string[]
	const decodedChrom2 = [
		'2',
		undefined,
		'6',
		'+',
		'6',
		'*',
		'6',
		'4',
		'1',
		'3',
		'6',
		'1',
		'/',
		'0',
		'1',
		'8',
		'+',
		'undefined',
		'0',
		'5',
	] as string[]
	const decodedChrom3 = ['2', '4', '+', '*', '/', 'undefined'] as string[]
	const decodedChrom4 = ['+', '*', '/', 'undefined'] as string[]
	const cleanupChrom1 = cleanup(decodedChrom1)
	const cleanupChrom2 = cleanup(decodedChrom2)
	const cleanupChrom3 = cleanup(decodedChrom3)
	const cleanupChrom4 = cleanup(decodedChrom4)
	expect(cleanupChrom1).toStrictEqual(['6', '*', '6', '+', '7'])
	expect(cleanupChrom2).toStrictEqual([
		'2',
		'+',
		'6',
		'*',
		'6',
		'/',
		'0',
		'+',
		'0',
	])
	expect(cleanupChrom3).toStrictEqual(['2'])
	expect(cleanupChrom4).toStrictEqual([])
})

test('check calculate equations', () => {
	const cleanupChrom1 = ['6', '*', '6', '+', '7'] as string[]
	const cleanupChrom2 = [
		'2',
		'+',
		'6',
		'*',
		'6',
		'/',
		'0',
		'+',
		'0',
	] as string[]
	const cleanupChrom3 = ['+'] as string[] // shouldn't happen because of the cleanup function
	const cleanupChrom4 = ['2', '+'] as string[] // shouldn't happen because of the cleanup function
	const cleanupChrom5 = [] as string[]
	const resultChrom1 = calculateEq(cleanupChrom1)
	const resultChrom2 = calculateEq(cleanupChrom2)
	const resultChrom3 = calculateEq(cleanupChrom3)
	const resultChrom4 = calculateEq(cleanupChrom4)
	const resultChrom5 = calculateEq(cleanupChrom5)
	expect(resultChrom1).toBe(43)
	expect(resultChrom2).toBe(2)
	expect(resultChrom3).toBe(0)
	expect(resultChrom4).toBe(2)
	expect(resultChrom5).toBe(0)
})

test('check roulette wheel', () => {
	const popFitness1 = [
		{
			chromosome: [
				[0, 0, 0, 1],
				[0, 1, 1, 0],
				[0, 0, 1, 0],
				[1, 1, 1, 1],
				[1, 1, 0, 0],
				[0, 1, 1, 0],
				[0, 0, 0, 0],
				[0, 0, 0, 0],
				[1, 1, 0, 0],
				[1, 0, 1, 0],
				[0, 1, 0, 1],
				[1, 0, 1, 0],
				[1, 1, 1, 0],
				[0, 1, 0, 1],
				[0, 0, 0, 1],
				[0, 1, 1, 1],
				[1, 1, 1, 0],
				[1, 0, 1, 1],
				[1, 0, 0, 0],
				[0, 1, 0, 1],
			],
			fitnessScore: 0.0625,
		},
		{
			chromosome: [
				[0, 1, 0, 1],
				[0, 0, 1, 1],
				[1, 1, 0, 0],
				[1, 1, 1, 0],
				[0, 1, 1, 0],
				[1, 1, 0, 1],
				[1, 1, 1, 1],
				[1, 0, 1, 0],
				[0, 0, 0, 1],
				[0, 0, 0, 1],
				[1, 0, 1, 0],
				[0, 1, 0, 0],
				[1, 0, 1, 0],
				[1, 0, 0, 0],
				[0, 1, 0, 0],
				[0, 1, 0, 1],
				[0, 0, 0, 1],
				[1, 0, 0, 0],
				[1, 1, 1, 0],
				[0, 1, 0, 0],
			],
			fitnessScore: 1,
		},
		{
			chromosome: [
				[1, 0, 1, 0],
				[1, 1, 1, 1],
				[0, 1, 0, 0],
				[0, 1, 1, 1],
				[0, 1, 1, 0],
				[1, 1, 0, 0],
				[0, 1, 1, 0],
				[0, 1, 0, 0],
				[0, 1, 0, 1],
				[1, 0, 0, 0],
				[0, 1, 1, 0],
				[0, 0, 0, 1],
				[0, 0, 1, 0],
				[0, 0, 1, 0],
				[0, 0, 0, 1],
				[0, 0, 0, 0],
				[1, 0, 1, 0],
				[0, 1, 0, 1],
				[0, 0, 1, 0],
				[0, 1, 0, 1],
			],
			fitnessScore: 0.07142857142857142,
		},
		{
			chromosome: [
				[1, 0, 1, 0],
				[1, 0, 1, 1],
				[0, 1, 0, 0],
				[0, 1, 1, 1],
				[1, 1, 1, 0],
				[1, 1, 0, 0],
				[0, 1, 1, 0],
				[0, 1, 0, 0],
				[0, 1, 0, 1],
				[1, 0, 0, 0],
				[0, 1, 1, 0],
				[1, 1, 0, 1],
				[1, 0, 1, 0],
				[0, 0, 1, 0],
				[1, 0, 0, 0],
				[0, 0, 0, 0],
				[1, 0, 1, 0],
				[0, 1, 0, 1],
				[0, 0, 0, 0],
				[0, 1, 0, 1],
			],
			fitnessScore: 0.038461538461538464,
		},
		{
			chromosome: [
				[0, 0, 0, 1],
				[0, 1, 1, 0],
				[0, 0, 1, 0],
				[1, 1, 1, 1],
				[1, 1, 0, 0],
				[1, 1, 1, 0],
				[1, 0, 0, 0],
				[1, 0, 0, 0],
				[1, 1, 0, 0],
				[1, 0, 1, 0],
				[0, 1, 0, 1],
				[1, 0, 1, 0],
				[1, 1, 1, 0],
				[0, 1, 0, 1],
				[1, 1, 0, 1],
				[0, 1, 1, 1],
				[1, 1, 1, 0],
				[1, 0, 1, 1],
				[1, 0, 1, 0],
				[0, 1, 0, 1],
			],
			fitnessScore: 0.13725490196078433,
		},
	] as unknown as PopulationFitness
	const popFitness2 = [
		{
			chromosome: [
				[0, 0, 0, 1],
				[0, 1, 1, 0],
				[0, 0, 1, 0],
				[1, 1, 1, 1],
				[1, 1, 0, 0],
				[0, 1, 1, 0],
				[0, 0, 0, 0],
				[0, 0, 0, 0],
				[1, 1, 0, 0],
				[1, 0, 1, 0],
				[0, 1, 0, 1],
				[1, 0, 1, 0],
				[1, 1, 1, 0],
				[0, 1, 0, 1],
				[0, 0, 0, 1],
				[0, 1, 1, 1],
				[1, 1, 1, 0],
				[1, 0, 1, 1],
				[1, 0, 0, 0],
				[0, 1, 0, 1],
			],
			fitnessScore: 0.0625,
		},
	] as unknown as PopulationFitness // this can't happen unless the user chooses a size 1 population
	const popFitness3 = [] as unknown as PopulationFitness // this can't happen because of the calculate function, unless user chooses a size 0 population
	const rouletteWheel1 = makeRouletteWheel(popFitness1)
	const rouletteWheel2 = makeRouletteWheel(popFitness2)
	// const rouletteWheel3 = makeRouletteWheel(popFitness3)
	expect(rouletteWheel1).toStrictEqual([
		{
			chromosome: [
				[0, 0, 0, 1],
				[0, 1, 1, 0],
				[0, 0, 1, 0],
				[1, 1, 1, 1],
				[1, 1, 0, 0],
				[0, 1, 1, 0],
				[0, 0, 0, 0],
				[0, 0, 0, 0],
				[1, 1, 0, 0],
				[1, 0, 1, 0],
				[0, 1, 0, 1],
				[1, 0, 1, 0],
				[1, 1, 1, 0],
				[0, 1, 0, 1],
				[0, 0, 0, 1],
				[0, 1, 1, 1],
				[1, 1, 1, 0],
				[1, 0, 1, 1],
				[1, 0, 0, 0],
				[0, 1, 0, 1],
			],
			start: 0,
			end: 4.7722855762012975,
		},
		{
			chromosome: [
				[0, 1, 0, 1],
				[0, 0, 1, 1],
				[1, 1, 0, 0],
				[1, 1, 1, 0],
				[0, 1, 1, 0],
				[1, 1, 0, 1],
				[1, 1, 1, 1],
				[1, 0, 1, 0],
				[0, 0, 0, 1],
				[0, 0, 0, 1],
				[1, 0, 1, 0],
				[0, 1, 0, 0],
				[1, 0, 1, 0],
				[1, 0, 0, 0],
				[0, 1, 0, 0],
				[0, 1, 0, 1],
				[0, 0, 0, 1],
				[1, 0, 0, 0],
				[1, 1, 1, 0],
				[0, 1, 0, 0],
			],
			start: 4.7722855762012975,
			end: 81.12885479542206,
		},
		{
			chromosome: [
				[1, 0, 1, 0],
				[1, 1, 1, 1],
				[0, 1, 0, 0],
				[0, 1, 1, 1],
				[0, 1, 1, 0],
				[1, 1, 0, 0],
				[0, 1, 1, 0],
				[0, 1, 0, 0],
				[0, 1, 0, 1],
				[1, 0, 0, 0],
				[0, 1, 1, 0],
				[0, 0, 0, 1],
				[0, 0, 1, 0],
				[0, 0, 1, 0],
				[0, 0, 0, 1],
				[0, 0, 0, 0],
				[1, 0, 1, 0],
				[0, 1, 0, 1],
				[0, 0, 1, 0],
				[0, 1, 0, 1],
			],
			start: 81.12885479542206,
			end: 86.58289545393782,
		},
		{
			chromosome: [
				[1, 0, 1, 0],
				[1, 0, 1, 1],
				[0, 1, 0, 0],
				[0, 1, 1, 1],
				[1, 1, 1, 0],
				[1, 1, 0, 0],
				[0, 1, 1, 0],
				[0, 1, 0, 0],
				[0, 1, 0, 1],
				[1, 0, 0, 0],
				[0, 1, 1, 0],
				[1, 1, 0, 1],
				[1, 0, 1, 0],
				[0, 0, 1, 0],
				[1, 0, 0, 0],
				[0, 0, 0, 0],
				[1, 0, 1, 0],
				[0, 1, 0, 1],
				[0, 0, 0, 0],
				[0, 1, 0, 1],
			],
			start: 86.58289545393782,
			end: 89.51968657775402,
		},
		{
			chromosome: [
				[0, 0, 0, 1],
				[0, 1, 1, 0],
				[0, 0, 1, 0],
				[1, 1, 1, 1],
				[1, 1, 0, 0],
				[1, 1, 1, 0],
				[1, 0, 0, 0],
				[1, 0, 0, 0],
				[1, 1, 0, 0],
				[1, 0, 1, 0],
				[0, 1, 0, 1],
				[1, 0, 1, 0],
				[1, 1, 1, 0],
				[0, 1, 0, 1],
				[1, 1, 0, 1],
				[0, 1, 1, 1],
				[1, 1, 1, 0],
				[1, 0, 1, 1],
				[1, 0, 1, 0],
				[0, 1, 0, 1],
			],
			start: 89.51968657775402,
			end: 100,
		},
	])
	expect(rouletteWheel2).toStrictEqual([
		{
			chromosome: [
				[0, 0, 0, 1],
				[0, 1, 1, 0],
				[0, 0, 1, 0],
				[1, 1, 1, 1],
				[1, 1, 0, 0],
				[0, 1, 1, 0],
				[0, 0, 0, 0],
				[0, 0, 0, 0],
				[1, 1, 0, 0],
				[1, 0, 1, 0],
				[0, 1, 0, 1],
				[1, 0, 1, 0],
				[1, 1, 1, 0],
				[0, 1, 0, 1],
				[0, 0, 0, 1],
				[0, 1, 1, 1],
				[1, 1, 1, 0],
				[1, 0, 1, 1],
				[1, 0, 0, 0],
				[0, 1, 0, 1],
			],
			start: 0,
			end: 100,
		},
	])
	// expect(rouletteWheel3).toStrictEqual([])
})

test('check couple choosen', () => {
	const rouletteWheel1 = [
		{
			chromosome: [
				[0, 0, 0, 1],
				[0, 1, 1, 0],
				[0, 0, 1, 0],
				[1, 1, 1, 1],
				[1, 1, 0, 0],
				[0, 1, 1, 0],
				[0, 0, 0, 0],
				[0, 0, 0, 0],
				[1, 1, 0, 0],
				[1, 0, 1, 0],
				[0, 1, 0, 1],
				[1, 0, 1, 0],
				[1, 1, 1, 0],
				[0, 1, 0, 1],
				[0, 0, 0, 1],
				[0, 1, 1, 1],
				[1, 1, 1, 0],
				[1, 0, 1, 1],
				[1, 0, 0, 0],
				[0, 1, 0, 1],
			],
			start: 0,
			end: 4.7722855762012975,
		},
		{
			chromosome: [
				[0, 1, 0, 1],
				[0, 0, 1, 1],
				[1, 1, 0, 0],
				[1, 1, 1, 0],
				[0, 1, 1, 0],
				[1, 1, 0, 1],
				[1, 1, 1, 1],
				[1, 0, 1, 0],
				[0, 0, 0, 1],
				[0, 0, 0, 1],
				[1, 0, 1, 0],
				[0, 1, 0, 0],
				[1, 0, 1, 0],
				[1, 0, 0, 0],
				[0, 1, 0, 0],
				[0, 1, 0, 1],
				[0, 0, 0, 1],
				[1, 0, 0, 0],
				[1, 1, 1, 0],
				[0, 1, 0, 0],
			],
			start: 4.7722855762012975,
			end: 81.12885479542206,
		},
		{
			chromosome: [
				[1, 0, 1, 0],
				[1, 1, 1, 1],
				[0, 1, 0, 0],
				[0, 1, 1, 1],
				[0, 1, 1, 0],
				[1, 1, 0, 0],
				[0, 1, 1, 0],
				[0, 1, 0, 0],
				[0, 1, 0, 1],
				[1, 0, 0, 0],
				[0, 1, 1, 0],
				[0, 0, 0, 1],
				[0, 0, 1, 0],
				[0, 0, 1, 0],
				[0, 0, 0, 1],
				[0, 0, 0, 0],
				[1, 0, 1, 0],
				[0, 1, 0, 1],
				[0, 0, 1, 0],
				[0, 1, 0, 1],
			],
			start: 81.12885479542206,
			end: 86.58289545393782,
		},
		{
			chromosome: [
				[1, 0, 1, 0],
				[1, 0, 1, 1],
				[0, 1, 0, 0],
				[0, 1, 1, 1],
				[1, 1, 1, 0],
				[1, 1, 0, 0],
				[0, 1, 1, 0],
				[0, 1, 0, 0],
				[0, 1, 0, 1],
				[1, 0, 0, 0],
				[0, 1, 1, 0],
				[1, 1, 0, 1],
				[1, 0, 1, 0],
				[0, 0, 1, 0],
				[1, 0, 0, 0],
				[0, 0, 0, 0],
				[1, 0, 1, 0],
				[0, 1, 0, 1],
				[0, 0, 0, 0],
				[0, 1, 0, 1],
			],
			start: 86.58289545393782,
			end: 89.51968657775402,
		},
		{
			chromosome: [
				[0, 0, 0, 1],
				[0, 1, 1, 0],
				[0, 0, 1, 0],
				[1, 1, 1, 1],
				[1, 1, 0, 0],
				[1, 1, 1, 0],
				[1, 0, 0, 0],
				[1, 0, 0, 0],
				[1, 1, 0, 0],
				[1, 0, 1, 0],
				[0, 1, 0, 1],
				[1, 0, 1, 0],
				[1, 1, 1, 0],
				[0, 1, 0, 1],
				[1, 1, 0, 1],
				[0, 1, 1, 1],
				[1, 1, 1, 0],
				[1, 0, 1, 1],
				[1, 0, 1, 0],
				[0, 1, 0, 1],
			],
			start: 89.51968657775402,
			end: 100,
		},
	] as unknown as RouletteWheel
	// const rouletteWheel2 = [
	// 	{
	// 		chromosome: [
	// 			[0, 0, 0, 1],
	// 			[0, 1, 1, 0],
	// 			[0, 0, 1, 0],
	// 			[1, 1, 1, 1],
	// 			[1, 1, 0, 0],
	// 			[0, 1, 1, 0],
	// 			[0, 0, 0, 0],
	// 			[0, 0, 0, 0],
	// 			[1, 1, 0, 0],
	// 			[1, 0, 1, 0],
	// 			[0, 1, 0, 1],
	// 			[1, 0, 1, 0],
	// 			[1, 1, 1, 0],
	// 			[0, 1, 0, 1],
	// 			[0, 0, 0, 1],
	// 			[0, 1, 1, 1],
	// 			[1, 1, 1, 0],
	// 			[1, 0, 1, 1],
	// 			[1, 0, 0, 0],
	// 			[0, 1, 0, 1],
	// 		],
	// 		start: 0,
	// 		end: 100,
	// 	},
	// ] as unknown as RouletteWheel // this can't happen because of the calculate function, unless user chooses a size 1 population
	// const rouletteWheel3 = [] as unknown as RouletteWheel // this can't happen because of the calculate function, unless user chooses a size 0 population
	const couple1 = chooseCouple(rouletteWheel1)
	// const couple2 = chooseCouple(rouletteWheel2)
	// const couple3 = chooseCouple(rouletteWheel3)
	expect(Object.keys(couple1).length).toBe(2)
	expect(couple1.chromosome1).not.toBe(couple1.chromosome2)
	// expect(couple2).toStrictEqual([
	// 	{
	// 		chromosome: [
	// 			[0, 0, 0, 1],
	// 			[0, 1, 1, 0],
	// 			[0, 0, 1, 0],
	// 			[1, 1, 1, 1],
	// 			[1, 1, 0, 0],
	// 			[0, 1, 1, 0],
	// 			[0, 0, 0, 0],
	// 			[0, 0, 0, 0],
	// 			[1, 1, 0, 0],
	// 			[1, 0, 1, 0],
	// 			[0, 1, 0, 1],
	// 			[1, 0, 1, 0],
	// 			[1, 1, 1, 0],
	// 			[0, 1, 0, 1],
	// 			[0, 0, 0, 1],
	// 			[0, 1, 1, 1],
	// 			[1, 1, 1, 0],
	// 			[1, 0, 1, 1],
	// 			[1, 0, 0, 0],
	// 			[0, 1, 0, 1],
	// 		],
	// 		start: 0,
	// 		end: 100,
	// 	},
	// ])
	// expect(couple3).toStrictEqual([])
})

test('check crossOver chance', () => {
	const crossOverChance = checkCrossOver()
	expect(crossOverChance).not.toBeUndefined()
	expect(crossOverChance).not.toBeNull()
})

test('check mutation chance', () => {
	const crossOverChance = checkMutation()
	expect(crossOverChance).not.toBeUndefined()
	expect(crossOverChance).not.toBeNull()
})

test('check chromosome division - put back together', () => {
	const stringChrom1 = [1, 0, 1, 0] as unknown as number[]
	// const stringChrom2 = [1, 0, 0] as unknown as number[] // shouldn't happen
	const chromosome1 = divideChromChunks(stringChrom1)
	expect(chromosome1).toStrictEqual([[1, 0, 1, 0]])
	expect(chromosome1.length).toBe(1)
})

test('check chromosome mutation', () => {
	const stringChrom1 = [
		1, 0, 1, 0, 1, 1, 0, 0, 1, 0, 0, 0, 1, 1, 0, 1, 0, 0, 1, 1,
	] as unknown as number[]
	const mutatedChrom1 = mutateChromosomes(stringChrom1)
	expect(mutatedChrom1.length).toBe(stringChrom1.length)
	mutatedChrom1.map((chrom) => {
		expect(chrom).toBeLessThan(2)
		expect(chrom).toBeGreaterThanOrEqual(0)
	})
})

test('check chromosome crossover', () => {
	const couple1 = {
		chromosome1: [
			[0, 1, 0, 1],
			[0, 0, 1, 1],
			[1, 1, 0, 0],
			[1, 1, 1, 0],
			[0, 1, 1, 0],
			[1, 1, 0, 1],
			[1, 1, 1, 1],
			[1, 0, 1, 0],
			[0, 0, 0, 1],
			[0, 0, 0, 1],
			[1, 0, 1, 0],
			[0, 1, 0, 0],
			[1, 0, 1, 0],
			[1, 0, 0, 0],
			[0, 1, 0, 0],
			[0, 1, 0, 1],
			[0, 0, 0, 1],
			[1, 0, 0, 0],
			[1, 1, 1, 0],
			[0, 1, 0, 0],
		],
		chromosome2: [
			[0, 0, 0, 1],
			[0, 1, 1, 0],
			[0, 0, 1, 0],
			[1, 1, 1, 1],
			[1, 1, 0, 0],
			[0, 1, 1, 0],
			[0, 0, 0, 0],
			[0, 0, 0, 0],
			[1, 1, 0, 0],
			[1, 0, 1, 0],
			[0, 1, 0, 1],
			[1, 0, 1, 0],
			[1, 1, 1, 0],
			[0, 1, 0, 1],
			[0, 0, 0, 1],
			[0, 1, 1, 1],
			[1, 1, 1, 0],
			[1, 0, 1, 1],
			[1, 0, 0, 0],
			[0, 1, 0, 1],
		],
	} as unknown as Couple
	const crossOverCouple1 = crossOver(couple1)
	expect(crossOverCouple1.chromosome1).not.toBe(crossOverCouple1.chromosome2)
})

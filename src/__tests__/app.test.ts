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
	const decodedGene1 = [
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
	const decodedGene2 = [
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
	const cleanupGene1 = cleanup(decodedGene1)
	const cleanupGene2 = cleanup(decodedGene2)
	expect(cleanupGene1).toStrictEqual(['6', '*', '6', '+', '7'])
	expect(cleanupGene2).toStrictEqual([
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
})

// add an argument to functions that have random called testing that is a boolean. The default is false, but if it is a test a call it with true.

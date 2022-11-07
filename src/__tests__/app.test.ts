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

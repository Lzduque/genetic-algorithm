import {describe, expect, test} from '@jest/globals'
import {
	createPopulation,
	Chromosome,
	createChromosome,
	createGene,
	createBit,
	checkFitnessScore,
	highNum,
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

// add an argument to functions that have random called testing that is a boolean. The default is false, but if it is a test a call it with true.

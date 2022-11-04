import {describe, expect, test} from '@jest/globals'
import {createPopulation, Chromosome} from '../app'

test('create a chromosome population', () => {
	const popSize = 10
	const chromSize = 15
	const population = createPopulation(popSize, chromSize)
	expect(population.length).toBe(popSize)
	population.forEach((chrom: Chromosome) => {
		expect(chrom.length).toBe(chromSize)
	})
})

// add an argument to functions that have random called testing that is a boolean. The default is false, but if it is a test a call it with true.

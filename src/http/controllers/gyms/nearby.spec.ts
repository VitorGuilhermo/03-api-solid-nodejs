import request from 'supertest'

import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

describe('Nearby Gyms (e2e)', () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it('shoud be able to list nearby gyms', async () => {
		const { token } = await createAndAuthenticateUser(app)

		await request(app.server)
			.post('/gyms')
			.set('Authorization', `Bearer ${token}`)
			.send({
				title: 'Mundo templo',
				description: 'Some description',
				phone: '129921145',
				latitude: -21.7682352,
				longitude: -50.9624695
			})

		await request(app.server)
			.post('/gyms')
			.set('Authorization', `Bearer ${token}`)
			.send({
				title: 'Power fitness gym',
				description: 'Some description',
				phone: '129921145',
				latitude: -21.7682352,
				longitude: -52.9624695
			})

		const response = await request(app.server)
			.get('/gyms/nearby')
			.query({
				latitude: -21.7682352,
				longitude: -50.9624695
			})
			.set('Authorization', `Bearer ${token}`)
			.send()


		expect(response.statusCode).toEqual(200)
		expect(response.body.gyms).toHaveLength(1)
		expect(response.body.gyms).toEqual([
			expect.objectContaining({
				title: 'Mundo templo',
			})
		])
	})
})
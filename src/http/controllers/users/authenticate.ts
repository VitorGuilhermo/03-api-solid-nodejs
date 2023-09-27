import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

import { InvalidCredentialsError } from '@/uses-cases/errors/invalid-credentials-error'
import { makeAuthenticateUseCase } from '@/uses-cases/factories/make-authenticate-use-case'

export async function authenticate(req: FastifyRequest, res: FastifyReply) {
	const authenticateBodySchema = z.object({
		email: z.string().email(),
		password: z.string().min(6),
	})

	const { email, password } = authenticateBodySchema.parse( req.body )

	try {
		const authenticateUseCase = makeAuthenticateUseCase()

		const { user } = await authenticateUseCase.execute({ email, password })

		const token = await res.jwtSign(
			{}, 
			{
				sign: {
					sub: user.id
				}
			}
		)

		return res.status(200).send({
			token
		})
	}
	catch(err) {
		if(err instanceof InvalidCredentialsError) {
			return res.status(400).send()
		}

		throw err
	}
}
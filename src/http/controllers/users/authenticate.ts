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
			{
				role: user.role,
			}, 
			{
				sign: {
					sub: user.id
				}
			}
		)

		const refreshToken = await res.jwtSign(
			{
				role: user.role,
			}, 
			{
				sign: {
					sub: user.id,
					expiresIn: '7d'
				}
			}
		)

		return res
			.setCookie('refreshToken', refreshToken, {
				path: '/',     //toda aplicação tem acesso
				secure: true,  //cookie encriptado através do https
				sameSite: true,//só vai ser acessível dento do msm domínio/site
				httpOnly: true //só é acessível no backend
			})
			.status(200).send({
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
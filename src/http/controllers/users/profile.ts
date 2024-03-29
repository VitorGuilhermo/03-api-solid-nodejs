import { makeGetUserProfileUseCase } from '@/uses-cases/factories/make-get-user-profile-use-case'
import { FastifyRequest, FastifyReply } from 'fastify'

export async function profile(req: FastifyRequest, res: FastifyReply) {
	const getUSerProfile = makeGetUserProfileUseCase()

	const { user } = await getUSerProfile.execute({
		userId: req.user.sub
	})

	return res.status(200).send({ 
		user: {
			...user,
			password_hash: undefined
		}
	})
}
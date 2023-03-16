import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

Prisma

export class PrismaUsersRepository {
	
	async create(data: Prisma.UserCreateInput) {
		const user = await prisma.user.create({
			data: data
		})

		return user
	}
}
import { hash } from "argon2";
import { Role } from "../../generated/prisma/enums";
import { UserWhereUniqueInput } from "../../generated/prisma/models";
import { prisma } from "../../lib/prisma";
import {
  InternalServerErrorException,
  NotFoundException,
} from "../../utils/error";
import { FindUsersQueryDto, UpdateUserDto } from "./users.schema";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import { PRISMA_CODES } from "../../constants";

export class UsersService {
  constructor() {}

  async findAllUsers(userId: string, query: FindUsersQueryDto) {
    query.page = query.page || 1;
    query.limit = query.limit || 10;
    const where: Record<string, unknown> = {
      id: { not: userId },
    };
    if (query.role) {
      where.role = query.role;
    }
    if (query.search) {
      where.name = {
        contains: query.search,
        mode: "insensitive",
      };
    }
    const skip = (query.page - 1) * query.limit;
    const take = query.limit;

    const users = await prisma.user.findMany({
      where,
      skip,
      take,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });
    const total = await prisma.user.count({ where, skip, take });

    return {
      users,
      meta: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.ceil(total / query.limit),
      },
    };
  }

  async findOne(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });
    if (!user) throw new NotFoundException(`User not found`);
    return user;
  }

  async updateOne(userId: string, role: Role, data: UpdateUserDto) {
    const where: UserWhereUniqueInput = {
      role: role === "admin" ? undefined : role,
      id: userId,
    };

    await this.findOne(userId);

    try {
      return await prisma.user.update({
        where,
        data: {
          name: data.name,
          passwordHash: data.password ? await hash(data.password) : undefined,
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
        },
      });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === PRISMA_CODES.NOT_FOUND
      ) {
        throw new NotFoundException("User not found");
      }
      throw new InternalServerErrorException();
    }
  }

  async deleteOne(userId: string) {
    const user = await prisma.user.delete({
      where: { id: userId },
    });
    if (!user) throw new NotFoundException(`User not found`);
  }
}

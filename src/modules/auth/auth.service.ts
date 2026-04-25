import { hash } from "argon2";
import { RegisterDto } from "./auth.schema";
import { prisma } from "../../lib/prisma";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import {
  ConflictException,
  InternalServerErrorException,
} from "../../utils/error";
import { PRISMA_CODES } from "../../constants";

export class AuthService {
  constructor() {}

  async register(data: RegisterDto) {
    try {
      const passwordHash = await hash(data.password);
      return await prisma.user.create({
        data: {
          name: data.name,
          email: data.email,
          passwordHash,
        },
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
        },
      });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === PRISMA_CODES.CONFLICT
      ) {
        throw new ConflictException("User with this email already exists");
      }
      throw new InternalServerErrorException();
    }
  }
}

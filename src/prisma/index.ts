// faz a conexão com o DB
import { PrismaClient } from "@prisma/client";

const prismaClient = new PrismaClient();

export { prismaClient };

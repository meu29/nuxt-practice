/* 1つのクライアントを使い回すため */

import { PrismaClient } from "@prisma/client";

export const prismaClient = new PrismaClient();
// database.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getAllUsers() {
    return await prisma.user.findMany({
        include: {
            subjects: true,
            group: true,
            refreshToken: true,
        },
    });
}

export async function createUser(data) {
    return await prisma.user.create({
        data: {
            email: data.email,
            password: data.password,
            roles: data.roles,
            group: data.groupId ? { connect: { id: data.groupId } } : undefined,
            subjects: data.subjectIds ? { connect: data.subjectIds.map(id => ({ id })) } : undefined,
        },
    });
}

export async function getAllTasks() {
    return await prisma.task.findMany({
        include: {
            subject: true,
            group: true,
            solutions: true,
        },
    });
}

export async function createTask(data) {
    return await prisma.task.create({
        data: {
            name: data.name,
            desc: data.desc,
            dead_line: data.deadLine,
            subject: { connect: { id: data.subjectId } },
            group: { connect: data.groupIds.map(id => ({ id })) },
        },
    });
}

export async function getAllGroups() {
    return await prisma.groups.findMany({
        include: {
            users: true,
            tasks: true,
        },
    });
}

export async function createGroup(data) {
    return await prisma.groups.create({
        data: {
            name: data.name,
            users: data.userIds ? { connect: data.userIds.map(id => ({ id })) } : undefined,
        },
    });
}

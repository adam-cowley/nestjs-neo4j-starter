import { Injectable } from "@nestjs/common";
import { Neo4jService } from "nest-neo4j/dist";
import { CreateUserDto } from "../dto/create-user.dto";
import { UpdateUserDto } from "../dto/update-user.dto";
import { EncryptionService } from "../encryption/encryption.service";
import { User } from "./user.entity";

@Injectable()
export class UserService {

    constructor(
        private readonly neo4jService: Neo4jService,
        private readonly encryptionService: EncryptionService
    ) {}

    find(email: any): Promise<User | undefined> {
        return this.neo4jService.read(`
            MATCH (u:User {email: $email})
            RETURN u
        `, { email })
        .then(res => res.records.length ? new User(res.records[0].get('u')) : undefined)
    }

    async create(user: CreateUserDto): Promise<User> {
        // Encrypt Password
        const password = await this.encryptionService.hash(user.password)

        return this.neo4jService.write(`
            CREATE (u:User { id: randomUUID() })
            SET u += $properties
            RETURN u
        `, { properties: {
            ...user,
            password,
        } })
            .then(res => new User(res.records[0].get('u')))
    }

    update(id: string, properties: UpdateUserDto): Promise<User> {
        return this.neo4jService.write(`
            MATCH (u:User { id: $id })
            SET u += $properties
            RETURN u
        `, { id, properties })
            .then(res => new User(res.records[0].get('u')))
    }
}
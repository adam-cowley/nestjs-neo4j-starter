import { Node } from 'neo4j-driver'
import { UserClaims } from './user-claims.interface'
import { UserProperties } from './user-properties.interface'

export class User {

    constructor(private readonly node: Node) {}

    getId(): string {
        return (<Record<string, any>> this.node.properties).id
    }

    getPassword(): string {
        return (<Record<string, any>> this.node.properties).password
    }

    getClaims(): UserClaims {
        const { password, ...properties } = <Record<string, any>> this.node.properties

        return properties as UserClaims
    }

    toJson(): UserProperties {
        const { password, ...properties } = <Record<string, any>> this.node.properties;

        return properties as UserProperties
    }
}
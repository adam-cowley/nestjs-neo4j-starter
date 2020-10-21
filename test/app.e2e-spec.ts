import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { Neo4jErrorFilter } from 'nest-neo4j/dist';

describe('AppController (e2e)', () => {
    let app: INestApplication;
    let api;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [
                AppModule
            ],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes( new ValidationPipe() )
        app.useGlobalFilters( new Neo4jErrorFilter() )
        await app.init();

        api = app.getHttpServer()
    });

    describe('/auth', () => {
        let email = `${Math.random()}@neo4j.com`
        let password = 'letmein'
        let token

        describe('POST /auth/register', () => {
            it('should validate the payload', () => {
                return request(api)
                    .post('/auth/register')
                    .send({})
                    .expect(400)
            })

            it('should create a user and return a JWT token', () => {
                return request(api)
                    .post('/auth/register')
                    .send({ email, password })
                    .expect(201)
                    .expect(res => {
                        expect(res.body.email).toEqual(email)
                        expect(res.body.password).toBeUndefined()
                        expect(res.body.token).toBeDefined()
                        token = res.body.token
                    })
            })

            it('should return a 400 Bad Request when username is taken', () => {
                return request(api)
                    .post('/auth/register')
                    .send({ email, password })
                    .expect(400)
            })
        })

        describe('POST /auth/login', () => {
            it('should validate the payload', () => {
                return request(api)
                    .post('/auth/login')
                    .send({})
                    .expect(401)
            })

            it('should return Unauthorised on bad credentials', () => {
                return request(api)
                    .post('/auth/login')
                    .send({ email, password: 'incorrect' })
                    .expect(401)
            })

            it('should log a user in and return a JWT token', () => {
                return request(api)
                    .post('/auth/login')
                    .send({ email, password })
                    .expect(201)
                    .expect(res => {
                        expect(res.body.email).toEqual(email)
                        expect(res.body.password).toBeUndefined()
                        expect(res.body.token).toBeDefined()
                        token = res.body.token
                    })
            })
        })

        describe('GET /auth/user', () => {
            it('should return forbidden on missing token', () => {
                return request(api)
                    .get('/auth/user')
                    .expect(401)
            })

            it('should return unauthorised if token signature is incorrect', () => {
                return request(api)
                    .get('/auth/user')
                    .set({ Authorization: `Token ${token.replace('a', 'X')}` })
                    .expect(401)
            })

            it('should return forbidden on incorrect token', () => {
                return request(api)
                    .get('/auth/user')
                    .set({ Authorization: `Token ${token}` })
                    .expect(200)
                    .expect(res => {
                        expect(res.body.email).toEqual(email)
                        expect(res.body.password).toBeUndefined()
                        expect(res.body.token).toBeDefined()
                    })
            })
        })

        describe('PUT /auth/user', () => {
            it('should return forbidden on missing token', () => {
                return request(api)
                    .put('/auth/user')
                    .expect(401)
            })

            it('should return unauthorised if token signature is incorrect', () => {
                return request(api)
                    .put('/auth/user')
                    .set({ Authorization: `Token ${token.replace('a', 'X')}` })
                    .expect(401)
            })

            it('should validate the payload', () => {
                return request(api)
                    .put('/auth/user')
                    .set({ Authorization: `Token ${token}` })
                    .expect(400)
            })

            it('should return forbidden on incorrect token', () => {
                const newEmail = `${Math.random()}@neo4j.com`
                const firstName = 'Adam'
                const lastName = 'Cowley'

                return request(api)
                    .put('/auth/user')
                    .set({ Authorization: `Token ${token}` })
                    .send({ email: newEmail, firstName, lastName })
                    .expect(200)
                    .expect(res => {
                        expect(res.body.email).toEqual(newEmail)
                        expect(res.body.firstName).toEqual(firstName)
                        expect(res.body.lastName).toEqual(lastName)
                        expect(res.body.password).toBeUndefined()
                        expect(res.body.token).toBeDefined()
                    })
            })
        })
    })
});

// redis.service.ts
import { Global, Injectable } from '@nestjs/common';
import * as redis from 'redis';
@Global()
@Injectable()
export class RedisService {
    public redisClient;

    constructor() {
        this.initializeRedis();
    }

    async initializeRedis() {
        this.redisClient = redis.createClient();

        this.redisClient.on("error", (error: any) => {
            console.log(error);
        });
        this.redisClient.on("connect", () => {
            console.log("Redis connected!");
        });

        await this.redisClient.connect();
    }
}

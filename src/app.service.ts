import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
    getHealth(): object {
        return {
            status: 'success',
            message: 'Server is running smoothly!',
            timestamp: new Date().toISOString(),
            environment: process.env.NODE_ENV || 'development',
        };
    }
}

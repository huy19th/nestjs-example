export interface Configuration {
    port: number;
    mongo: {
        uri: string;
    };
    redis: {
        url: string;
        username: string;
        password: string;
    };
    nodemailer: {
        user: string;
        pass: string;
        host: string;
        port: number;
    };
}
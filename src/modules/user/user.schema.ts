import { BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { MongoError } from 'mongodb';
import normalizeEmail from 'normalize-email';
import * as bcrypt from 'bcrypt';
import { ROLE_USER } from './user.constant';

export type UserDocument = HydratedDocument<User>;

@Schema({
    versionKey: false,
    timestamps: true
})
export class User {

    @Prop({
        type: String,
        required: [true, 'Email required'],
        unique: true,
        validate: {
            validator: function (value: string) {
                return /^\S+@\S+\.\S+$/.test(value);
            },
            message: prop => `${prop.value} is not a valid email`
        }
    })
    email: string;

    @Prop({
        type: String,
        required: [true, 'Password required']
    })
    password: string;

    @Prop({
        type: String
    })
    username?: string;

    @Prop({
        type: Number,
        default: ROLE_USER
    })
    role: number;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', function (next: Function) {
    let user: UserDocument = this;

    if (!user.isModified('email')) user.email = normalizeEmail(user.email);

    if (!user.isModified('password')) return next();

    bcrypt.hash(user.password, 10, function (err: Error, hash: string) {
        if (err) return next(err);
        user.password = hash;
        next();
    });
});

UserSchema.post('save', function (err: MongoError, doc: UserDocument, next: Function) {
    if (err.code == 11000) {
        next(new BadRequestException('Email already exists'));
    }
    else {
        next(new InternalServerErrorException(err.message));
    }
});

UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    let isMatch: boolean = await bcrypt.compare(candidatePassword, this.password);
    return isMatch;
};
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';
import { CreateUserDto, UpdateUserDto } from './user.dto';

@Injectable()
export class UserService {

    constructor(
        @InjectModel(User.name) private userModel: Model<User>
    ) { }

    create(data: CreateUserDto): Promise<UserDocument> {
        return this.userModel.create(data);
    }

    findUserByEmail(email: string, lean: boolean = false): Promise<UserDocument> {
        return this.userModel.findOne({ email }).lean(lean);
    }

    findUserById(id: string, lean: boolean = false): Promise<UserDocument> {
        return this.userModel.findById(id).lean(lean);
    }

    getUserProfile(id: string): Promise<{ email: string, username: string }> {
        return this.userModel.findById(id).select('-_id email username').lean();
    }

    async updateUser(userId: string, updateUserDto: UpdateUserDto): Promise<UserDocument> {
        let user = await this.userModel.findByIdAndUpdate(userId, updateUserDto, { new: true });
        if (!user) throw new NotFoundException('User not found');
        return user;
    }

    async deleteUser(userId: string): Promise<void> {
        await this.userModel.findByIdAndDelete(userId);
    }
}
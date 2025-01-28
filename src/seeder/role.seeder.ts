import 'dotenv/config';
import mongoose from 'mongoose';
import connectDatabase from '../config/db.config';
import RoleModel from '../models/role-permission.model';
import { RolePermission } from '../utils/role-permission';
import { RoleEnumType } from '../enums/role.enum';

const seedRoles = async () => {
   console.log('Starting role seeding...');

   await connectDatabase();
   const session = await mongoose.startSession();
   session.startTransaction();

   try {
      console.log('Clearing existing roles...');
      await RoleModel.deleteMany({}, { session });

      const rolesToInsert = Object.entries(RolePermission).map(
         ([role, permissions]) => ({
            name: role as RoleEnumType,
            permissions,
         })
      );

      console.log(`Inserting ${rolesToInsert.length} roles...`);
      await RoleModel.insertMany(rolesToInsert, { session });

      await session.commitTransaction();
      console.log('Seeding completed successfully.');
   } catch (error) {
      await session.abortTransaction();
      console.error('Error during seeding:', error);
   } finally {
      session.endSession();
      process.exit(0);
   }
};

seedRoles().catch((error) =>
   console.error('Error running seed script:', error)
);

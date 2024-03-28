## npx prisma init

Creates a new prisma directory with the following contents:
- **schema.prisma**: Specifies your database connection and contains the database schema
- **.env**: A dotenv file, typically used to store your database credentials in a group of environment variables

## npx prisma generate
- Run this command after every change to your Prisma models to update your generated Prisma Client.
- During installation, Prisma automatically invokes the prisma generate command for you

## npx prisma migrate dev --name <migration_name>
Generates SQL files and directly runs them against the database.

- tree prisma  
prisma  
├── dev.db  
├── migrations  
│   └── 20201207100915_<migration_name>  
│       └── migration.sql  
└── schema.prisma  

## npx prisma db pull
- Reads the DATABASE_URL environment variable that's defined in .env and connects to your database
- Once the connection is established, it reads the database schema & then translates the database schema from SQL into a data model in your Prisma schema
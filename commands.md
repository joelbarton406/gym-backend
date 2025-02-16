1. `npm i body-parser compression cookie-parser cors dotenv drizzle-orm express pg`
2. `npm i -D @types/body-parser @types/compression @types/cookie-parser @types/cors @types/express @types/node @types/pg drizzle-kit nodemon ts-node typescript`
3. tsconfig.json
   ```json
   {
     "compilerOptions": {
       "module": "NodeNext",
       "moduleResolution": "node",
       "baseUrl": "src",
       "outDir": "dist",
       "sourceMap": true,
       "noImplicitAny": true
     },
     "include": ["src/**/*"]
   }
   ```
4. nodemon.json
   ```json
   {
     "watch": ["src"],
     "ext": ".ts, .js",
     "exec": "ts-node ./src/index.ts"
   }
   ```

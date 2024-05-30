# ---- Base Node ----
FROM node:19-alpine AS base
WORKDIR /app
COPY package*.json ./

# ---- Dependencies ----
FROM base AS dependencies
RUN npm ci

# ---- Build ----
FROM dependencies AS build
COPY . .

# Chatbot UI
ENV DEFAULT_MODEL="gpt-4"
ENV NEXT_PUBLIC_DEFAULT_SYSTEM_PROMPT="You are ChatGPT, a large language model trained by OpenAI. Follow the user\'s instructions carefully. Respond using markdown."

# Supabase
ENV NEXT_PUBLIC_SUPABASE_URL="https://nhrevgrugfgtbxdaeyqy.supabase.co"
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ocmV2Z3J1Z2ZndGJ4ZGFleXF5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTY5MTYxODIsImV4cCI6MjAzMjQ5MjE4Mn0.RooyEV7Fn4rtW8CLNEFSzcZFX3Mel9rjvUOmGfa68w0"

RUN npm run build

# ---- Production ----
FROM node:19-alpine AS production
WORKDIR /app
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/package*.json ./
COPY --from=build /app/next.config.js ./next.config.js
COPY --from=build /app/next-i18next.config.js ./next-i18next.config.js

# Expose the port the app will run on
EXPOSE 3000

# Start the application
CMD ["npm", "start"]

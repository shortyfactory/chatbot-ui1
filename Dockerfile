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

ARG DEFAULT_MODEL
ARG NEXT_PUBLIC_DEFAULT_SYSTEM_PROMPT
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY

ENV DEFAULT_MODEL $DEFAULT_MODEL
ENV NEXT_PUBLIC_DEFAULT_SYSTEM_PROMPT $NEXT_PUBLIC_DEFAULT_SYSTEM_PROMPT
ENV NEXT_PUBLIC_SUPABASE_URL $NEXT_PUBLIC_SUPABASE_URL
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY $NEXT_PUBLIC_SUPABASE_ANON_KEY

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

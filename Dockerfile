FROM oven/bun:1 AS base
WORKDIR /usr/src/app

# Install OpenSSL agar Prisma dapat berjalan
RUN apt-get update && apt-get install -y openssl

# install dependencies into temp directory
# this will cache them and speed up future builds
FROM base AS install
RUN mkdir -p /temp/dev
COPY package.json bun.lockb tsconfig.json /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile

RUN mkdir -p /temp/prod
COPY package.json bun.lockb tsconfig.json /temp/prod/
RUN cd /temp/prod && bun install --frozen-lockfile --production

# copy node_modules from temp directory
# then copy all (non-ignored) project files into the image
FROM base AS prerelease
COPY --from=install /temp/dev/node_modules node_modules
COPY src  /usr/src/app/src
COPY prisma  /usr/src/app/prisma
COPY tailwind.config.js  /usr/src/app/
COPY .env /usr/src/app/.env
COPY bunfig.toml /usr/src/app/
COPY tsconfig.json /usr/src/app/
RUN bunx tailwindcss -i /usr/src/app/src/public/css/input.css -o /usr/src/app/src/public/css/final.css
RUN bunx postcss /usr/src/app/src/public/css/final.css -o /usr/src/app/src/public/css/final-min.css
RUN bunx prisma migrate deploy
RUN bunx prisma generate
RUN bun build --sourcemap /usr/src/app/src/index.ts --outdir /usr/src/app/.dist --target bun

# copy production dependencies and source code into final image
FROM base AS release
COPY --from=install /temp/dev/node_modules node_modules
COPY --from=prerelease /usr/src/app/node_modules/.prisma/client node_modules/.prisma/client
COPY --from=prerelease /usr/src/app/src/public /usr/src/app/src/public
COPY --from=prerelease /usr/src/app/.dist/index.js .
COPY --from=prerelease /usr/src/app/.dist/index.js.map .
COPY --from=prerelease /usr/src/app/.env /usr/src/app/.env
COPY package.json /usr/src/app/
COPY tsconfig.json /usr/src/app/

RUN chmod -R 777 /usr/src/app/src/public/img/storage
RUN chown -R bun:bun /usr/src/app/src/public/img/storage

# run the app
USER bun
EXPOSE 8500/tcp
ENTRYPOINT [ "bun", "run", "index.js" ]
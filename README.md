# The Website

## How do I get started?

1. Fork the website repo at ...
2. Clone the repo to your local machine
3. Know how to write a website in Next.js / tailwindcss

## Where are the important parts?

### Backend

- device api is in `src/pages/api/device_client/post.ts`
- demo api is in `src/server/api/routers/demo_client.ts`
- authenticated user api is in `src/server/api/routers/user_client.ts`

Demo and authenticated user api's should be almost the same, but the demo client should only use Max McKelvey's personal data, and it should be ***READ ONLY***.

### Frontend

- components are in `src/components`
- pages are in `src/pages`

## The Database

- Schema is configured by prisma in the `prisma/schema.prisma` file

## Database Cron Job

There is one cron job to keep the database from sleeping.

- The cron job is in `src/pages/api/cron.ts`
- The cron configuration is in `vercel.json`

## The Stack: Create T3 App

This is a [T3 Stack](https://create.t3.gg/) project bootstrapped with `create-t3-app`.

- [Next.js](https://nextjs.org)
- [NextAuth.js](https://next-auth.js.org)
- [Prisma](https://prisma.io)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)

### Learn More

To learn more about the [T3 Stack](https://create.t3.gg/), take a look at the following resources:

- [Documentation](https://create.t3.gg/)
- [Learn the T3 Stack](https://create.t3.gg/en/faq#what-learning-resources-are-currently-available) — Check out these awesome tutorials

You can check out the [create-t3-app GitHub repository](https://github.com/t3-oss/create-t3-app) — your feedback and contributions are welcome!

### How do I deploy this?

Follow our deployment guides for [Vercel](https://create.t3.gg/en/deployment/vercel), [Netlify](https://create.t3.gg/en/deployment/netlify) and [Docker](https://create.t3.gg/en/deployment/docker) for more information.

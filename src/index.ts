/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.toml`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */
import { AutoRouter, withParams } from 'itty-router'
import { Redis } from '@upstash/redis'


export interface Env {
	UPSTASH_TOKEN: string;
  }

const router = AutoRouter();

router.get('/', () => new Response('Hello World!'));

router.get('/wallet/:walletAddress/games', withParams, async (request: Request, env: Env, ctx: ExecutionContext) => {
	const walletAddress = request.params.walletAddress;
	console.log(walletAddress);
	const redis = new Redis({
		url: 'https://superb-marmoset-20181.upstash.io',
		token: env.UPSTASH_TOKEN,
	})
	const games = await redis.hget('walletAddrToGames', walletAddress);
  if(!games) {
	return new Response('No games found');
  } else {
	return new Response(JSON.stringify(games));
  }
});


// export default {
// 	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {

// 		// const redis = new Redis({
// 		// 	url: 'https://superb-marmoset-20181.upstash.io',
// 		// 	token: env.UPSTASH_TOKEN,
// 		// })
// 	  return router.handle(request, env, ctx);
// 	}
//   } satisfies ExportedHandler<Env>;

export default { ...router } // this looks pointless, but trust us

// export default {
// 	async fetch(request, env, ctx): Promise<Response> {
// 		// return router.handle(request, env, ctx);
// 		return new Response('Hello World!');
// 	},
// } satisfies ExportedHandler<Env>;

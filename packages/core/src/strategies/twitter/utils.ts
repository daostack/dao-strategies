import { World } from '../../world/World';

function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export async function getTweetRetweeters(world: World, tweetId: string): Promise<Array<string>> {
    const usersPaginated = await world.twitter.v2.tweetRetweetedBy(tweetId, { asPaginator: true, 'user.fields': ['username'] });
    console.log('rate limit at start:', usersPaginated.rateLimit);

    while (!usersPaginated.done) {
        if (usersPaginated.rateLimit.remaining == 0) {
            let timeToWait = usersPaginated.rateLimit.reset - (Date.now() / 1000) + 10;
            console.log('waiting due to rate limit. next rate reset timestamp:', usersPaginated.rateLimit.reset);
            await delay(timeToWait * 1000);
        }

        await usersPaginated.fetchNext();
    }
    return usersPaginated.users.map(user => user.username);
}

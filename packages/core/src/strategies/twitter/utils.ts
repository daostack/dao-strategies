import { World } from '../../world/World';

function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export async function getTweetRetweeters(world: World, tweetId: string): Promise<Array<string>> {
    const usersPaginated = await world.twitter.v2.tweetRetweetedBy(tweetId, { asPaginator: true, 'user.fields': ['username'] });
    console.log('rate limit at start:', usersPaginated.rateLimit);
    //let users: Array<string> = [];

    while (!usersPaginated.done) {
        if (usersPaginated.rateLimit.remaining == 0) {
            let timeToWait = usersPaginated.rateLimit.reset - (Date.now() / 1000) + 10;
            await delay(timeToWait * 1000);
        }

        await usersPaginated.fetchNext();
    }
    //for await (const user of usersPaginated) {
    //    users.push(user.username);
    //}

    return usersPaginated.users.map(user => user.username);
}

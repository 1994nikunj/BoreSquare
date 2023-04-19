import axios from 'axios';
import { nanoid } from 'nanoid';

const BASE_URL = 'https://api.foursquare.com/v3/places'
const API_KEY = 'YOUR KEY HERE';

const cursorMap = new Map();

let searchparams = new URLSearchParams({
	radius: 1000,
	fields: 'fsq_id,name,location,distance',
	sort: 'DISTANCE',
	limit: 5,
});

const options = {
	method: 'GET',
	headers: {
		accept: 'application/json',
		Authorization: API_KEY
	}
};

async function getImage(id) {
	const request_params = { ...options, url: `${BASE_URL}/${id}/photos` };
	try {
		const response = await axios.request(request_params);
		const image = response.data.length > 0
			? response.data[0].prefix + '500x500' + response.data[0].suffix
			: '';
		return image;
	} catch (error) {
		console.error(error);
		return '';
	}
}

function getCursor(linkHeader) {
	if (linkHeader) {
		const links = linkHeader.split(',');
		const nextLink = links.find((l) => l.includes('rel="next"'));
		if (nextLink) {
			const url = new URL(nextLink.split(';')[0].slice(1, -1));
			const cursor = url.searchParams.get('cursor');
			return cursor;
		}
	}
}

const resolvers = {
	// --------------------- Query Resolvers --------------------- //
	Query: {
		// Make a call to the Places API to get the location posts
		locationPosts: async (_, { pageNum }) => {
			try {
				// console.log('SERVER: pageNum: ', pageNum);

				let response = null;
				let request_params = null;
				let cursor = null;
				const request_url = `${BASE_URL}/search?${searchparams}`;

				if (pageNum == 0) {
					return [];
				} else if (pageNum == 1) {
					request_params = { ...options, url: request_url };
					response = await axios.request(request_params);
					const linkHeader = response.headers.link;
					cursor = getCursor(linkHeader);
					cursorMap.set(pageNum, cursor);
				} else if (pageNum > 1) {
					cursor = cursorMap.get(pageNum - 1);
					if (!cursor) {
						// If cursor is not found in map for the previous page, return empty array
						return [];
					}
					searchparams.set('cursor', cursor);
					const request_url = `${BASE_URL}/search?${searchparams}`;
					request_params = { ...options, url: request_url };
					response = await axios.request(request_params);
					const linkHeader = response.headers.link;
					cursor = getCursor(linkHeader);
					cursorMap.set(pageNum, cursor);
				}

				// print all the names in the response
				// let idx = 1;
				// response.data.results.forEach((location) => {
				// 	console.log(`${idx++}: ${location.name}`);
				// });

				const locations = response.data.results.map(async (location) => ({
					id: location.fsq_id,
					image: await getImage(location.fsq_id),
					name: location.name,
					address: location.location.formatted_address,
					userPosted: false,
					liked: false,
					distance: location.distance
				}));

				return locations;
			} catch (error) {
				console.error(error);
				return [];
			}
		},
		// Retrieve the user's liked locations from Redis
		likedLocations: async (_, args, { redisClient }) => {
			try {
				const userLikedLocations = await redisClient.hGetAll('likedLocations');
				const locations = Object.entries(userLikedLocations).map(([, value]) => JSON.parse(value));
				return locations;
			} catch (error) {
				console.error(error);
				return [];
			}
		},

		// Retrieve the user's posted locations from Redis
		userPostedLocations: async (_, args, { redisClient }) => {
			try {
				const userPostedLocations = await redisClient.hGetAll('userPostedLocations');
				const locations = Object.entries(userPostedLocations).map(([, value]) => JSON.parse(value));
				return locations;
			} catch (error) {
				console.error(error);
				return [];
			}
		},

		// Retrieve the top 10 closest locations from Redis
		getTopTenClosestLocations: async (_, args, { redisClient }) => {
			try {
				const locations = await redisClient.zRange('locationsByDistance', 0, 9, { REV: true });
				const parsedLocations = [];
				for (let i = 0; i < locations.length; i += 2) {
					const loc = JSON.parse(locations[i]);
					loc.distance = locations[i + 1];
					parsedLocations.push(loc);
				}

				return parsedLocations;
			} catch (error) {
				console.error(error);
				return [];
			}
		},
	},

	// --------------------- Mutation Resolvers --------------------- //
	Mutation: {
		// Upload a new location to Redis
		uploadLocation: async (_, args, { redisClient }) => {
			try {
				const userPostedLocation = {
					id: nanoid(24),
					image: args.image,
					name: args.name,
					address: args.address,
					userPosted: true,
					liked: false
				};

				await redisClient.hSet('userPostedLocations', userPostedLocation.id, JSON.stringify(userPostedLocation));
				return userPostedLocation;
			}
			catch (error) {
				console.error(error);
				return [];
			}
		},

		// Update the location in Redis
		updateLocation: async (_, args, { redisClient }) => {
			try {
				const { id, image, name, address, userPosted, liked } = args;
				const location = { id, image, name, address, userPosted, liked };

				if (!userPosted) {
					if (liked) {
						await redisClient.hSet('likedLocations', id, JSON.stringify(location));
					} else {
						await redisClient.hDel('likedLocations', id);
					}
				} else {
					if (!liked) {
						await redisClient.hDel('likedLocations', id);
						location.liked = false;
						await redisClient.hSet('userPostedLocations', id, JSON.stringify(location));
					} else {
						await redisClient.hSet('userPostedLocations', id, JSON.stringify(location));
						await redisClient.hSet('likedLocations', id, JSON.stringify(location));
					}
				}

				return location;
			} catch (error) {
				console.error(error);
				return [];
			}
		},

		// Remove the location from Redis
		deleteLocation: async (_, args, { redisClient }) => {
			try {
				const { id } = args;

				const deletedLocation = await redisClient.hGet('userPostedLocations', id);
				const deletedFieldCount = await redisClient.hDel('userPostedLocations', id);

				if (deletedFieldCount === 1) {
					return JSON.parse(deletedLocation);
				} else {
					return [];
				}
			}
			catch (error) {
				console.error(error);
				return [];
			}
		}
	},
};

export default resolvers;
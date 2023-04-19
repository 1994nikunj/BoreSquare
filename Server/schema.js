import { gql } from 'apollo-server';

const typeDefs = gql`
	type Location {
		id: ID!
		image: String!
		name: String!
		address: String
		userPosted: Boolean!
		liked: Boolean!
		distance: Int
	}

	type Query {
		locationPosts(pageNum: Int): [Location]
		likedLocations: [Location]
		userPostedLocations: [Location]
		getTopTenClosestLocations: [Location]
	}

	type Mutation {
		uploadLocation(
			image: String!, 
			name: String, 
			address: String
		): Location
		updateLocation(
			id: ID!, 
			image: String, 
			name: String, 
			address: String, 
			userPosted: Boolean, 
			liked: Boolean,
			distance: Int
		): Location
		deleteLocation(id: ID!): Location
	}
`;

export default typeDefs;
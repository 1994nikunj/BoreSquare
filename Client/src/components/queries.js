import { gql } from '@apollo/client';

// QUERY
const GET_LOCATION_FROM_API = gql`
	query GET_LOCATION_FROM_API($pageNum: Int) {
		locationPosts(pageNum: $pageNum) {
			id
			image
			name
			address
			userPosted
			liked
		}
	}
`;

const GET_USER_LIKER_LOCATIONS = gql`
	query GET_USER_LIKER_LOCATIONS {
		likedLocations {
			id
			image
			name
			address
			userPosted
			liked
		}
	}
`;

const GET_USER_POSTED_LOCATIONS = gql`
	query GET_USER_POSTED_LOCATIONS {
		userPostedLocations {
			id
			image
			name
			address
			userPosted
			liked
		}
	}
`;

const GET_TOP_TEN_CLOSEST_LOCATIONS = gql`
	query GET_TOP_TEN_CLOSEST_LOCATIONS {
		getTopTenClosestLocations {
			id
			image
			name
			address
			userPosted
			liked
			distance
		}
	}
`;

// MUTATION
const ADD_NEW_USER_LOCATION = gql`
	mutation ADD_NEW_USER_LOCATION (
		$image: String!,
		$name: String!,
		$address: String!
	) {
		uploadLocation(
			image: $image,
			name: $name,
			address: $address
		) {
			id
			image
			name
			address
			userPosted
			liked
		}
	}
`;

const UPDATE_USER_LOCATION = gql`
	mutation UPDATE_USER_LOCATION(
		$id: ID!,
		$image: String,
		$name: String,
		$address: String,
		$userPosted: Boolean,
		$liked: Boolean,
		$distance: Int
	) {
		updateLocation(
			id: $id,
			image: $image,
			name: $name,
			address: $address,
			userPosted: $userPosted,
			liked: $liked,
			distance: $distance
		) {
			id
			image
			name
			address
			userPosted
			liked
		}
	}
`;

const DELETE_USER_LOCATION = gql`
	mutation DELETE_USER_LOCATION($id: ID!) {
		deleteLocation(id: $id) {
			id
			image
			name
			address
			userPosted
			liked
		}
	}
`;

let exported = {
	GET_LOCATION_FROM_API,
	GET_USER_LIKER_LOCATIONS,
	GET_USER_POSTED_LOCATIONS,
	ADD_NEW_USER_LOCATION,
	GET_TOP_TEN_CLOSEST_LOCATIONS,
	UPDATE_USER_LOCATION,
	DELETE_USER_LOCATION
};

export default exported;
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import queries from './queries';
import { Button } from 'react-bootstrap';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { IconButton, Tooltip } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import Fade from '@mui/material/Fade';
import ListLocations from './ListLocations';
import './App.css';

function LocationList() {
	const [page, setPage] = useState(1);
	const [loadingMore, setLoadingMore] = useState(false);
	const [currentPageLocations, setCurrentPageLocations] = useState([]);
	const { loading, error, data, fetchMore } = useQuery(queries.GET_LOCATION_FROM_API, {
		variables: { pageNum: page },
		fetchPolicy: 'cache-and-network',
	});
	const [updateLocation] = useMutation(queries.UPDATE_USER_LOCATION);
	const [loadedLocationIds, setLoadedLocationIds] = useState(new Set());

	const scrollToTop = () => {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};

	const scrollToBottom = () => {
		window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
	};

	useEffect(() => {
		if (data?.locationPosts) {
			setCurrentPageLocations((existing) => {
				const incoming = data.locationPosts.filter((location) => !loadedLocationIds.has(location.id));
				setLoadedLocationIds((prevIds) => new Set([...prevIds, ...incoming.map((location) => location.id)]));
				return [...existing, ...incoming];
			});
		}
	}, [data, loadedLocationIds]);

	const handleLike = (location) => {
		updateLocation({
			variables: {
				id: location.id,
				name: location.name,
				address: location.address,
				liked: !location.liked,
				image: location.image,
				userPosted: false
			},
			optimisticResponse: {
				__typename: 'Mutation',
				updateLocation: {
					__typename: 'Location',
					id: location.id,
					name: location.name,
					address: location.address,
					liked: !location.liked,
					image: location.image,
					userPosted: false
				},
			},
			update: (cache, { data: { updateLocation } }) => {
				const { locationPosts } = cache.readQuery({
					query: queries.GET_LOCATION_FROM_API,
					variables: { pageNum: page },
				});

				const updatedPosts = locationPosts.map((post) =>
					post.id === updateLocation.id ? updateLocation : post
				);

				cache.writeQuery({
					query: queries.GET_LOCATION_FROM_API,
					variables: { pageNum: page },
					data: { locationPosts: updatedPosts },
				});

				setCurrentPageLocations(updatedPosts);
			},
		});
	};

	const handleLoadMore = () => {
		setLoadingMore(true);
		fetchMore({
			variables: { pageNum: page + 1 },
			updateQuery: (prev, { fetchMoreResult }) => {
				if (!fetchMoreResult) return prev;
				setPage(page + 1);
				return fetchMoreResult;
			},
		}).then(() => setLoadingMore(false));
	};

	if (loading && currentPageLocations.length === 0) {
		return (
			<div>
				<h2>Loading data, please wait...</h2>
			</div>
		);
	} else if (error) {
		return (
			<div>
				<h2>Error: {error.message}</h2>
			</div>
		);
	} else {
		return (
			<div style={{ display: 'flex', justifyContent: 'center' }}>
				<div style={{ width: '580px' }}>
					{currentPageLocations.map((location) => (
						<div
							key={location.id}
							style={{
								border: "none",
								borderRadius: "2rem",
								backgroundColor: "#150941",
								boxShadow: "0px 0px 20px #000",
								position: "relative",
								height: "550px",
								color: "#C6C3CF",
								marginBottom: "3rem",
								marginTop: "3rem",
							}}
						>
							<ListLocations
								location={location}
							/>
							{/* Like/Dislike Button */}
							<IconButton
								sx={{
									backgroundColor: '#9763F7',
									color: location.liked ? 'red' : 'white',
									boxShadow: '0px 0px 10px #000',
									position: 'absolute',
									top: '-25px',
									right: '-25px',
									zIndex: '1',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									'&:hover': {
										border: 'none',
										backgroundColor: '#9763F7',
										boxShadow: '0px 0px 20px #64A137;',
									}
								}}
								onClick={() => handleLike(location)}
							>
								<FavoriteIcon style={{ fontSize: "3rem", color: "inherit" }} />
							</IconButton>
						</div>
					))}

					{/* Get More BUTTON */}
					<Button
						variant="contained"
						onClick={handleLoadMore}
						disabled={loadingMore}
						className="load-button"
					>
						Get More
					</Button>

					{/* SCROLL TO BOTTOM BUTTON */}
					<Tooltip
						title="Scroll to bottom"
						placement="left"
						arrow
						TransitionComponent={Fade}
						TransitionProps={{ timeout: 600 }}
					>
						<IconButton
							className={`scroll-button`}
							onClick={scrollToBottom}
							style={{ position: 'fixed', bottom: '20px', right: '20px' }}
						>
							<ExpandMoreIcon />
						</IconButton>
					</Tooltip>

					{/* SCROLL TO TOP BUTTON */}
					<Tooltip
						title="Scroll to top"
						placement="left"
						arrow
						TransitionComponent={Fade}
						TransitionProps={{ timeout: 600 }}
					>
						<IconButton
							className={`scroll-button`}
							onClick={scrollToTop}
							style={{ position: 'fixed', bottom: '70px', right: '20px' }}
						>
							<ExpandLessIcon />
						</IconButton>
					</Tooltip>
				</div>
			</div>
		);
	}
};

export default LocationList;
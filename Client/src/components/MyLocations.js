import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { NavLink } from 'react-router-dom';
import queries from './queries';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { IconButton, Tooltip, Button } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import AddLocationIcon from '@mui/icons-material/AddLocation';
import Fade from '@mui/material/Fade';

import EditLocationModal from './modals/EditLocationModal';
import DeleteLocationModal from './modals/DeleteLocationModal';

import ListLocations from './ListLocations';
import './App.css';


function MyLocations() {
	const [currentPageLocations, setCurrentPageLocations] = useState([]);

	const [showEditModal, setShowEditModal] = useState(false);
	const [showDeleteModal, setShowDeleteModal] = useState(false);

	const [editLocation, setEditLocation] = useState(null);
	const [deleteLocation, setDeleteLocation] = useState(null);

	const [updated, setUpdated] = useState(false);

	const { loading, error, data } = useQuery(queries.GET_USER_POSTED_LOCATIONS, {
		fetchPolicy: 'cache-and-network'
	});

	const [updateLocation] = useMutation(queries.UPDATE_USER_LOCATION, {
		onCompleted: () => {
			window.location.reload();
		},
	});

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
			}
		});
		setUpdated(true);
	};

	const addLocationButtonCSS = {
		margin: '10px',
		padding: '10px',
		width: '550px',
		height: '50px',
		borderRadius: '30px',
		border: 'none',
		color: '#150941',
		backgroundColor: '#64A137',
		boxShadow: '0px 0px 10px #000000;',
		'&:hover': {
			border: 'none',
			backgroundColor: '#73ba3f',
			color: '#150941',
			boxShadow: '0px 0px 30px #000000;',
		}
	};

	const EditDeleteButtonCSS = {
		margin: '10px',
		padding: '10px',
		fontSize: '1.1rem',
		width: '250px',
		height: '50px',
		cursor: 'pointer',
		borderRadius: '20px',
		border: 'none',
		color: '#150941',
		backgroundColor: '#9763F7',
		boxShadow: '0px 0px 10px #000000;',
		'&:hover': {
			border: 'none',
			backgroundColor: '#73ba3f',
			color: '#150941',
			boxShadow: '0px 0px 30px #000000;',
		}
	};

	const NavigationButton = ({ to, icon, label }) => {
		return (
			<Button
				sx={addLocationButtonCSS}
				startIcon={icon}
				component={NavLink}
				to={to}
			>
				{label}
			</Button>
		);
	};

	const handleOpenEditModal = (location) => {
		setShowEditModal(true);
		setEditLocation(location);
	};

	const handleOpenDeleteModal = (location) => {
		setShowDeleteModal(true);
		setDeleteLocation(location);
	};

	const handleCloseModal = () => {
		setShowEditModal(false);
		setShowDeleteModal(false);
	};

	const scrollToTop = () => {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};

	const scrollToBottom = () => {
		window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
	};

	useEffect(() => {
		if (data && data.userPostedLocations) {
			setCurrentPageLocations((prevLocations) => [
				...prevLocations,
				...data.userPostedLocations,
			]);
		}
	}, [data]);

	useEffect(() => {
		if (updated) {
			window.location.reload();
		}
	}, [updated]);

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
					{/* Button to go to /new-location page */}
					<NavigationButton
						to="/new-location"
						icon={<AddLocationIcon />}
						label='Add Location'
					/>
					{currentPageLocations.map((location) => (
						<div
							key={location.id}
							style={{
								border: "none",
								borderRadius: "2rem",
								backgroundColor: "#150941",
								boxShadow: "0px 0px 20px #000",
								position: "relative",
								height: "590px",
								color: "#C6C3CF",
								marginBottom: "5rem",
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
										boxShadow: '0px 0px 30px #64A137;',
									}
								}}
								onClick={() => handleLike(location)}
							>
								<FavoriteIcon style={{ fontSize: "3rem", color: "inherit" }} />
							</IconButton>

							<Button
								onClick={() => {
									handleOpenEditModal(location);
								}}
								sx={EditDeleteButtonCSS}
							>
								EDIT
							</Button>
							<Button
								onClick={() => {
									handleOpenDeleteModal(location);
								}}
								sx={EditDeleteButtonCSS}
							>
								DELETE
							</Button>
						</div>
					))}

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

					{/*Edit Location Modal*/}
					{showEditModal && (
						<EditLocationModal
							is_open={showEditModal}
							handle_close={handleCloseModal}
							location={editLocation}
						/>
					)}

					{/*Delete Location Modal*/}
					{showDeleteModal && (
						<DeleteLocationModal
							is_open={showDeleteModal}
							handle_close={handleCloseModal}
							location={deleteLocation}
						/>
					)}
				</div>
			</div>
		);
	}
};

export default MyLocations;
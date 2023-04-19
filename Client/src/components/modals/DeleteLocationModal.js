import React, { useState } from 'react';
import '../App.css';
import ReactModal from 'react-modal';
import { useMutation } from '@apollo/client';
import queries from '../queries.js';
import { Button } from '@mui/material';
import WrongLocationIcon from '@mui/icons-material/WrongLocation';
import CancelIcon from '@mui/icons-material/Cancel';

ReactModal.setAppElement('#root');
const customStyles = {
	content: {
		top: '50%',
		left: '50%',
		right: 'auto',
		bottom: 'auto',
		marginRight: '-50%',
		transform: 'translate(-50%, -50%)',
		width: '50%',
		border: '1px solid #28547a',
		borderRadius: '20px',
		backgroundColor: '#150941',
		color: 'white',
		boxShadow: '0px 0px 20px #000',
	}
};

const buttonCSS = {
	margin: '10px',
	padding: '10px',
	fontSize: '1rem',
	width: '150px',
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

function DeleteLocationModal(props) {
	const [showDeleteModal, setShowDeleteModal] = useState(props.is_open);
	const [location, setLocation] = useState(props.location);

	const [deleteLocation] = useMutation(queries.DELETE_USER_LOCATION, {
		update(cache, { data: { deleteLocation } }) {
			const { userPostedLocations } = cache.readQuery({
				query: queries.GET_USER_POSTED_LOCATIONS
			});
			cache.writeQuery({
				query: queries.GET_USER_POSTED_LOCATIONS,
				data: { userPostedLocations: userPostedLocations.filter(location => location.id !== deleteLocation.id) }
			});
		}
	});

	const handleCloseDeleteModal = () => {
		setShowDeleteModal(false);
		setLocation(null);
		props.handle_close(false);
	}

	return (
		<>
			<ReactModal
				name='deleteModal'
				isOpen={showDeleteModal}
				contentLabel='Delete Location'
				style={customStyles}
			>
				<div
					style={{
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
						flexDirection: 'column',
						backgroundColor: '#150941',
					}}
				>
					<span>Are you sure you want to delete {location.name}?</span>
					<form
						className='form'
						id='delete-location-form'
						onSubmit={(e) => {
							e.preventDefault();
							deleteLocation({
								variables: {
									id: location.id
								}
							});
							setShowDeleteModal(false);
							alert('Location Deleted');
							props.handle_close(false);
						}}
					>
						<Button
							type='submit'
							sx={buttonCSS}
							startIcon={<WrongLocationIcon />}
						>
							Delete
						</Button>
						<Button
							onClick={handleCloseDeleteModal}
							sx={buttonCSS}
							startIcon={<CancelIcon />}
						>
							Cancel
						</Button>
					</form>
				</div>
			</ReactModal>
		</>
	);
}

export default DeleteLocationModal;
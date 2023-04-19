import React, { useState } from 'react';
import '../App.css';
import ReactModal from 'react-modal';
import { useMutation } from '@apollo/client';
import queries from '../queries.js';
import { Button, FormControl, TextField } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';

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

const formCSS = {
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'center',
	alignItems: 'center',
	padding: '20px',
	borderRadius: '20px',
};

const textFieldCSS = {
	width: '100%',
	backgroundColor: '#7F7B9C',
	borderRadius: '10px',
	color: 'white',
	marginTop: '5px',
	marginBottom: '10px',
};

const formControlCSS = {
	marginBottom: '10px',
	width: '100%',
	textTransform: 'uppercase',
	fontWeight: 'bold',
	textShadow: '0px 0px 10px #000000',
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

function EditLocationModal(props) {
	const [showEditModal, setShowEditModal] = useState(props.is_open);
	const [location, setLocation] = useState(props.location);
	const [editLocation] = useMutation(queries.UPDATE_USER_LOCATION);

	const handleCloseEditModal = () => {
		setShowEditModal(false);
		setLocation(null);
		props.handle_close(false);
	}

	let image, name, address, userPosted, liked;

	if (location) {
		name = location.name;
		image = location.image;
		address = location.address;
		userPosted = Boolean(location.userPosted);
		liked = Boolean(location.liked);
	}

	console.log('location', location);

	return (
		<>
			<ReactModal
				name='editModal'
				isOpen={showEditModal}
				contentLabel='Edit Location'
				style={customStyles}
			>
				<form
					sx={formCSS}
					id='edit-location-form'
					onSubmit={(e) => {
						e.preventDefault();
						editLocation({
							variables: {
								id: props.location.id,
								name: name.value,
								address: address.value,
								image: image.value,
								userPosted: Boolean(userPosted.value),
								liked: Boolean(liked.value)
							}
						});
						name.value = '';
						image.value = '';
						address.value = '';
						userPosted.value = Boolean;
						liked.value = Boolean;
						setShowEditModal(false);

						alert('Location updated!');
						props.handle_close();
					}}
				>
					<FormControl
						sx={formControlCSS}
					>
						Name:
						<TextField
							sx={textFieldCSS}
							inputRef={(node) => { name = node; }}
							defaultValue={location.name}
							autoFocus={true}
						/>
					</FormControl>
					<FormControl
						sx={formControlCSS}
					>
						Address:
						<TextField
							sx={textFieldCSS}
							inputRef={(node) => { address = node; }}
							defaultValue={location.address}
						/>
					</FormControl>
					<FormControl
						sx={formControlCSS}
					>
						Image:
						<TextField
							sx={textFieldCSS}
							inputRef={(node) => { image = node; }}
							defaultValue={location.image}
						/>
					</FormControl>
					<FormControl
						sx={formControlCSS}
					>
						User Posted:
						<TextField
							sx={textFieldCSS}
							inputRef={(node) => { userPosted = node; }}
							defaultValue={Boolean(location.userPosted)}
						/>
					</FormControl>
					<FormControl
						sx={formControlCSS}
					>
						Liked:
						<TextField
							sx={textFieldCSS}
							inputRef={(node) => { liked = node; }}
							defaultValue={Boolean(location.liked)}
						/>
					</FormControl>
					<div
						style={{
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
							flexDirection: 'row',
						}}
					>
						<Button
							type='submit'
							sx={buttonCSS}
							startIcon={<EditIcon />}
						>
							Update
						</Button>
						<Button
							sx={buttonCSS}
							startIcon={<CloseIcon />}
							onClick={() => {
								handleCloseEditModal();
							}}
						>
							Close
						</Button>
					</div>
				</form>
			</ReactModal>
		</>
	);
}

export default EditLocationModal;
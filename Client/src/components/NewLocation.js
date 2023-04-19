import React, { useState } from 'react';
import './App.css';
import { Card, Row, Col } from 'react-bootstrap';
import { Button, FormControl, TextField } from '@mui/material';
import { useMutation } from '@apollo/client';
import queries from './queries';
import PublishIcon from '@mui/icons-material/Publish';

function NewLocation() {
	const [name, setName] = useState('');
	const [address, setAddress] = useState('');
	const [image, setImage] = useState('');

	const [addLocation] = useMutation(queries.ADD_NEW_USER_LOCATION, {
		update(cache, { data: { addLocation } }) {
			const { userPostedLocations } = cache.readQuery({
				query: queries.GET_USER_POSTED_LOCATIONS,
			});
			cache.writeQuery({
				query: queries.GET_USER_POSTED_LOCATIONS,
				data: {
					userPostedLocations: userPostedLocations.concat([addLocation]),
				},
			});
		},
	});

	const handleSubmit = (e) => {
		e.preventDefault();
		addLocation({ variables: { name, address, image } });
		alert('New Location Added');
	};

	const submitButtonCSS = {
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
		textAlign: 'left',
		textTransform: 'uppercase',
		fontWeight: 'bold',
		textShadow: '0px 0px 10px #000000',
	};

	return (
		<div style={{ display: 'flex', justifyContent: 'center' }}>
			<div style={{ width: '580px' }}>
				<Row>
					<Col
						md={6}
						className="mb-4"
						style={{
							display: "flex",
							alignItems: "center",
							justifyContent: "center"
						}}
					>
						<Card
							style={{
								border: "none",
								color: "#C6C3CF",
								margin: "1rem",
								padding: "1rem",
								width: "100%",
								borderRadius: "2rem",
								backgroundColor: "#150941",
								boxShadow: "0px 0px 20px #000",
							}}
						>
							<Card.Title
								style={{
									fontWeight: "bold",
									marginBottom: "20px",
									fontSize: "1.6rem"
								}}
							>
								Add Location
							</Card.Title>

							<form
								onSubmit={handleSubmit}
							>
								<Card.Body>
									<FormControl
										sx={formControlCSS}
									>
										Name:
									</FormControl>
									<TextField
										type='text'
										id='name'
										placeholder='Enter name'
										onChange={(e) => setName(e.target.value)}
										sx={textFieldCSS}
										autoFocus={true}
									/>
									<FormControl
										sx={formControlCSS}
									>
										Address:
									</FormControl>
									<TextField
										type='text'
										id='address'
										placeholder='Enter address'
										sx={textFieldCSS}
										onChange={(e) => setAddress(e.target.value)}
									/>
									<FormControl
										sx={formControlCSS}
									>
										Image:
									</FormControl>
									<TextField
										type='text'
										id='image'
										placeholder='Enter image url'
										sx={textFieldCSS}
										onChange={(e) => setImage(e.target.value)}
									/>
									<Button
										type='submit'
										sx={submitButtonCSS}
										startIcon={<PublishIcon />}
									>
										Submit
									</Button>
								</Card.Body>
							</form>
						</Card>
					</Col>
				</Row>
			</div>
		</div>
	);
}

export default NewLocation;
import React from 'react';
import './App.css';
import {
	NavLink,
	BrowserRouter as Router,
	Route,
	Routes
} from 'react-router-dom';
import Home from './Home';
import MyLikes from './MyLikes';
import MyLocations from './MyLocations';
import NewLocation from './NewLocation';
import NotFound from './NotFound';
import {
	ApolloClient,
	HttpLink,
	ApolloProvider,
	InMemoryCache
} from '@apollo/client';
import { Button } from '@mui/material';
import logo from './asset/logo.png';
import HomeIcon from '@mui/icons-material/Home';
import FavoriteIcon from '@mui/icons-material/Favorite';
import MyLocationIcon from '@mui/icons-material/MyLocation';


// Reference: https://www.apollographql.com/tutorials/fullstack-quickstart/07-setting-up-apollo-client
const client = new ApolloClient({
	cache: new InMemoryCache(),
	link: new HttpLink({
		uri: ' http://localhost:4000/graphql'
	})
});

function App() {
	const buttonCSS = {
		margin: '10px',
		padding: '10px',
		width: '170px',
		height: '50px',
		borderRadius: '30px',
		border: 'none',
		color: '#150941',
		backgroundColor: '#9763F7',
		boxShadow: '0px 0px 15px #000000;',
		'&:hover': {
			border: 'none',
			color: '#150941',
			backgroundColor: '#64A137',
			boxShadow: '0px 0px 30px #000000;',
		}
	};

	const NavigationButton = ({ to, icon, label }) => {
		return (
			<Button
				sx={buttonCSS}
				startIcon={icon}
				component={NavLink}
				to={to}
			>
				{label}
			</Button>
		);
	};

	return (
		<ApolloProvider client={client}>
			<Router>
				<div className='App'>

					<header className='App-header'>
						<img src={logo} className='App-logo' alt='logo' />
						<h1 className='App-title'>Welcome to BoreSquare!</h1>
						<NavigationButton to='/' icon={<HomeIcon />} label='Home' />
						<NavigationButton to='/my-likes' icon={<FavoriteIcon />} label='My Likes' />
						<NavigationButton to='/my-locations' icon={<MyLocationIcon />} label='My Locations' />
					</header>

					<Routes>
						<Route path='/' element={<Home />} />
						<Route path='/my-likes' element={<MyLikes />} />
						<Route path='/my-locations' element={<MyLocations />} />
						<Route path='/new-location' element={<NewLocation />} />
						<Route path="*" element={<NotFound />} />
					</Routes>

				</div>
			</Router>
		</ApolloProvider>
	);
}

export default App;

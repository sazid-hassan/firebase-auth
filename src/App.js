import './App.css';

import * as firebase from 'firebase/app';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import GoogleIcon from '@mui/icons-material/Google';

import 'firebase/auth';
import { firebaseConfig } from './firebase.config';
import { useState } from 'react';

if (!firebase.apps.length) {
	firebase.initializeApp(firebaseConfig);
}

function App() {

	const [user, setUser] = useState([
		{
			isSignedIn: false,
			name: '',
			mail: '',
			password: '',
			img: '',
			success: false
		}
	])

	var [errorMsg, setErrorMsg] = useState('');
	const [newUser, setNewUser] = useState(true);


	const provider = new firebase.auth.GoogleAuthProvider();

	const signIn = () => {

		firebase.auth().signInWithPopup(provider)
			.then((res) => {

				const { displayName, photoURL, email } = res.user;
				const signedUser = {
					isSignedIn: true,
					name: displayName,
					mail: email,
					password: '',
					img: photoURL,
					success: true,
				}
				setUser(signedUser);

			})
			.catch(err => {
				console.log(err);
			})



	}

	const signout = () => {
		firebase.auth().signOut()
			.then(res => {
				const outUser = {

					isSignedIn: false,
					name: '',
					mail: '',
					password: '',
					img: '',
					success: false

				}
				setUser(outUser);
			})
			.catch(err => {
				console.log(err);
			})
	}

	const handleSubmit = (e) => {
		if (newUser && user.mail && user.password) {

			firebase.auth().createUserWithEmailAndPassword(user.mail, user.password)
				.then(res => {
					const newUserInfo = { ...user };
					newUserInfo.isSignedIn = true;
					const errmsg = '';
					newUserInfo.success = true;
					setErrorMsg(errmsg);
					setUser(newUserInfo);
					updateUserName(user.name);
				}
				)
				.catch((error) => {
					const newUserInfo = { ...user };
					const errMsg = error.message;
					newUserInfo.success = false;
					newUserInfo.isSignedIn = true;
					console.log(newUserInfo, errMsg);
					setErrorMsg(errMsg);
				});
		}
		else if (!newUser && user.mail && user.password) {
			firebase.auth().signInWithEmailAndPassword(user.mail, user.password)
				.then(res => {
					console.log("Success");
					const loggedUser = { ...user };
					loggedUser.isSignedIn = true;
					loggedUser.name = res.user.displayName;
					setUser(loggedUser);
				})
		}
		e.preventDefault();

	}

	const handleBlur = (e) => {
		const newUserReq = { ...user };

		newUserReq[e.target.name] = e.target.value;
		setUser(newUserReq);
	}

	const updateUserName = name => {
		const user = firebase.auth().currentUser;

		user.updateProfile({
			displayName: name,
		})
			.then(() => {
				console.log("Successfully updated");
			})
			.catch((err) => {
				console.log(err);
			})
	}

	return (
		<div className="App">

			{
				!user.isSignedIn &&
				<>
					<form onSubmit={handleSubmit}>
						{
							newUser &&
							<TextField
								type='text'
								placeholder='Name'
								name='name'
								onBlur={handleBlur}
								variant="standard"
								required
							/>
						}
						<br />
						<TextField
							type="email"
							placeholder="Email"
							name='mail'
							onBlur={handleBlur}
							variant="standard"
							required
						/>
						<br />
						<TextField
							type="password"
							placeholder="Password"
							name='password'
							onBlur={handleBlur}
							variant="standard"
							required
						/>
						<br />
						<TextField type="submit" placeholder="Submit" />
					</form>

					{
						errorMsg &&
						<p style={{
							color: 'red'
						}}>{errorMsg}</p>
					}
					{
						newUser &&

						<Button
							onClick={signIn}
							variant="contained"
							color="success"
						>
							<GoogleIcon />
							Sign Up With Google
						</Button>
					}
					{
						!newUser &&

						<Button
							onClick={signIn}
							variant="contained"
						>
							<GoogleIcon />

							Sign In With Google
						</Button>
					}
					<p>Or </p>
					{
						newUser &&
						<Button
							variant='contained'
							onClick={() => setNewUser(!newUser)}
						>
							Sign In
						</Button>
					}
					{
						!newUser &&
						<Button
							variant='contained'
							color="success"
							onClick={() => setNewUser(!newUser)}
						>
							Sign Up
						</Button>
					}
				</>

			}
			{
				user.isSignedIn &&
				<>
					<h2>Welcome {user.name}</h2>
					{
						user.photoURL &&
						<img src={user.img}
							alt={user.name}
						/>
					}
					<br />
					<Button onClick={signout}>Sign Out</Button>
				</>
			}


		</div>
	);
}

export default App;

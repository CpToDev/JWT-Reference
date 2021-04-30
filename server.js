require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();

app.use(express.json());

const posts = [
	{
		name: 'saurav',
		title: 'post 1'
	},
	{
		name: 'aman',
		title: 'post 2'
	},
	{
		name: 'aman',
		title: 'post 3'
	},
	{
		name: 'aman',
		title: 'post 4'
	}
];

app.get('/posts', authenticateToken, (req, res) => {
	res.json(posts.filter((post) => post.name == req.user.name));
});

app.post('/login', (req, res) => {
	//authentication

	const username = req.body.username;
	const user = {
		name: username
	};
	const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
	res.json({ accessToken: accessToken });
});

function authenticateToken(req, res, next) {
	const authHeader = req.headers['authorization'];

	const token = authHeader && authHeader.split(' ')[1];

	if (token == null) return res.sendStatus(401);

	jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
		if (err) return res.status(403).json({ err });

		req.user = user;
		next();
	});
}

app.listen(3000, () => {
	console.log('Server started on port 3000');
});

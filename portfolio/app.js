const express = require('express');

const bodyParser = require('body-parser');

const { check, validationResult } = require('express-validator');

const nodemailer = require('nodemailer');

const ejs = require('ejs');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

//middleware for parsing JSON in request body
app.use(express.json());

app.use('/public/assets/', express.static('public/assets'));


app.get('/', (request, response) => {

	response.render('contact', { errors : '' });

});

app.post('/send', 
	[
		check('name').notEmpty().withMessage('Name is required'),
		check('email').isEmail().withMessage('Invalid Email Address'),
		check('subject').notEmpty().withMessage('Subject is required'),
		check('message').notEmpty().withMessage('Message is required')
	], (request, response) => {


		const output = `
    <p>You have a new contact request pls check</p>
    <h3>Contact Details</h3>
    <ul>  
      <li>Name: ${request.body.name}</li>
      <li>Email: ${request.body.email}</li>
      <li>Phone: ${request.body.phone}</li>
    </ul>
    <h3>Message</h3>
    <p>${request.body.message}</p>
  `;


		const errors = validationResult(request);

		if(!errors.isEmpty())
		{
			response.render('contact', { errors : errors.mapped() });
		}
		else
		{
			const transporter = nodemailer.createTransport({
				service : 'Gmail',
				auth : {
					user : 'Portfoliocontact24@gmail.com',
					pass : 'iyjrugvcdkifhmbz'
				}
			});

			const mail_option = {
				from : request.body.email,
				to : 'monicashinee1623@gmail.com',
                subject : request.body.subject,
				text : request.body.message,
				 html: output
			};

			transporter.sendMail(mail_option, (error, info) => {
				if(error)
				{
					console.log(error);
				}
				else
				{
					response.redirect('..');
				}
			});
		}
});

app.get('/success', (request, response) => {

	response.send('<h1>Your Message was Successfully Send!</h1> ');

});

//start server
app.listen(3000, () => {

	console.log('Server started on port 3000');

});
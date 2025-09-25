The project generates images using AI with just a prompt. Clipdrop API is used to generate images.
There is a dark theme toggle which toggles app between light and dark mode.
For payment Razorpay is used. 
User receives a mail regarding account creation and OTP to reset password. Brevo is used to mail configuration.

Create .env file in Client
VITE_BACKEND_URL = 'http://localhost:4000'
VITE_RAZORPAY_KEY_ID = your razorpay key_id

Create .env file in Server 
MONGODB_URI = your-mongodb-uri
JWT_SECRET = your-jwt-secret
CLIPDROP_API = your-clipdrop-api-key
CURRENCY = 'USD'
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-key-secret

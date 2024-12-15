const express = require('express');
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const cors = require('cors');
const checkErrorsRouter = require('./routes/checkErrors');
const compareCodeRouter = require('./routes/compareCode');
const checkLogicalErrorsRouter = require('./routes/checkLogicalErrors');
const authRoutes = require('./routes/auth');
const saveLogicalErrorsRoute = require('./routes/saveLogicalErrors');
const errorSuggestionsRouter = require('./routes/errorSuggestions'); // Import the new router
const getErrorDataRouter = require('./routes/getErrorData'); // Import the new router



const app = express();
app.use(cors());
app.use(bodyParser.json());

// Use the checkErrors router
app.use('/api/checkErrors', checkErrorsRouter);

// Use the compareCode router
app.use('/api/compareCode', compareCodeRouter);

app.use('/api/checkLogicalErrors', checkLogicalErrorsRouter);
app.use('/api/saveLogicalErrors', saveLogicalErrorsRoute);
app.use('/api/errorSuggestions', errorSuggestionsRouter); // Use the new error suggestions router
app.use('/api/getErrorData', getErrorDataRouter); // Use the new error data router




const URL = "mongodb+srv://bhawan:200132400588@atlascluster.fl5bp73.mongodb.net/?retryWrites=true&w=majority&appName=AtlasCluster"; 

mongoose.connect(URL, { //connect mongodb
    //useCreateIndex: true, 
    //useNewUrlParser: true,
    //useUnifiedTopology: true,
    //useFindAndModify: false
});

const connection = mongoose.connection; //hadagatta connection eka open karagannawa
connection.once("open", () => {
    console.log("Mongodb connection success!"); //if success
})

app.use('/api/auth', authRoutes);


// Start the server
const port = process.env.PORT || 5001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

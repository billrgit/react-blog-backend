import express from 'express';
import bodyParser from 'body-parser';
import { MongoClient } from 'mongodb';
import path from 'path';
import withDB from './withDB';
const app = express();

app.use(express.static(path.join(__dirname, '/build')));
app.use(bodyParser.json());

app.get('/api/articles/:name', async (req, res) => {
	//info at 178:28/305:29 in class video
	const articleName = req.params.name;
	
	try {
		const client = await MongoClient.connect(
			'mongodb://localhost:27017',
			{ useNewUrlParser: true, useUnifiedTopology: true }
	   );
   
	   const db = client.db('react-blog-db');
   
	   const articlesInfo = await db.collection('articles').findOne({ name: articleName });
							
		res.status(200).json(articlesInfo);
		client.close();

	} catch (e) {
       res.status(500).json(e);
	}
      //await withDB(async db => {
	//	  if (!db) {
	//		  console.log('Database error');
	//	  } else {
	//        const articlesInfo = await db.collection('articles')
	//		    .findOne({ name: articleName });
	//				
	//		res.status(200).json(articlesInfo);
	//	  }
	 // });
});


app.post('/api/articles/:name/upvote', async (req, res) => {
	const articleName = req.params.name;

	try {
		const client = await MongoClient.connect(
			'mongodb://localhost:27017',
			{ useNewUrlParser: true, useUnifiedTopology: true }
	   );
   
	   const db = client.db('react-blog-db');
   
	   const articlesInfo = await db.collection('articles')
			.findOne({ name: articleName });
			
			await db.collection('articles').updateOne(
				{ name: articleName },
				{'$set': { upvotes: articlesInfo.upvotes + 1 }},
				);
   
				const updatedArticleInfo = await db.collection('articles')
					.findOne({ name: articleName });
					
				res.status(200).json(updatedArticleInfo);
				client.close();

	} catch (e) {
       res.status(500).json(e);
	}


	});

app.post('/api/articles/:name/add-comment', async (req, res) => {
	const articleName = req.params.name;
	const newComment = req.body.comment;

	try {
		const client = await MongoClient.connect(
			'mongodb://localhost:27017',
			{ useNewUrlParser: true, useUnifiedTopology: true }
	   );
   
	   const db = client.db('react-blog-db');
   
	   const articlesInfo = await db.collection('articles')
			.findOne({ name: articleName });
			
			await db.collection('articles').updateOne(
				{ name: articleName },
				{'$set': { comments: articlesInfo.comments.concat(newComment) }},
				);
   
				const updatedArticleInfo = await db.collection('articles')
					.findOne({ name: articleName });
					
				res.status(200).json(updatedArticleInfo);
				client.close();
	} catch (e) {
       res.status(500).json(e);
	}

	
	
//	res.status(200).send(articlesInfo[articleName]);
});

app.listen(8000, () => {
	console.log('Server is listening on port 8000')
});

db.atamalar.aggregate(

	// Pipeline
	[
		// Stage 1
		{
			$match: { "_id": ObjectId("5a3eaedb73743d401c40efab") }
		},

		// Stage 2
		{
			$lookup: {
			                "from": "pools",
			                "localField": "pool_id",
			                "foreignField": "_id",
			                "as": "pool"
			            }
			
			// Uncorrelated Subqueries
			// (supported as of MongoDB 3.6)
			// {
			//    from: "<collection to join>",
			//    let: { <var_1>: <expression>, …, <var_n>: <expression> },
			//    pipeline: [ <pipeline to execute on the collection to join> ],
			//    as: "<output array field>"
			// }
		},

		// Stage 3
		{
			$lookup: {
			                "from": "documents",
			                "localField": "pool.document_id",
			                "foreignField": "document_no",
			                "as": "doc"
			            }
			
			// Uncorrelated Subqueries
			// (supported as of MongoDB 3.6)
			// {
			//    from: "<collection to join>",
			//    let: { <var_1>: <expression>, …, <var_n>: <expression> },
			//    pipeline: [ <pipeline to execute on the collection to join> ],
			//    as: "<output array field>"
			// }
		},

		// Stage 4
		{
			$unwind: {
			                path : "$doc",
			                includeArrayIndex :"0"
			            }
		},

		// Stage 5
		{
			$lookup: {
			                "from": "topics",
			                "localField": "topic_id",
			                "foreignField": "topic_id",
			                "as": "topic"
			            }
			
			// Uncorrelated Subqueries
			// (supported as of MongoDB 3.6)
			// {
			//    from: "<collection to join>",
			//    let: { <var_1>: <expression>, …, <var_n>: <expression> },
			//    pipeline: [ <pipeline to execute on the collection to join> ],
			//    as: "<output array field>"
			// }
		},

		// Stage 6
		{
			$unwind: {
			                path : "$topic",
			                includeArrayIndex :"0"
			            }
		},

		// Stage 7
		{
			$project: {				
			  				"topic": {
			                    "_id": "$topic._id",
			                    "topic_id": "$topic.topic_id",
			                    "title": "$topic.title",
			                    "description": "$topic.description",
			                    "narrative": "$topic.narrative"
			                },
			                "document": {
			                    "_id": "$doc._id",
			                    "document_no": "$pool.document_id",
			                    "document_file": "$doc.document_file"
			                },
			                "assignment":{
			                    "_id":"$_id",
			                    "is_related": "$is_related",
			                    "assignedDate": { $dateToString: { format: "%d/%m/%Y %H:%M", date: "$assigned_date" } }
			
			                }
			                
			            }
		},

	]

	// Created with Studio 3T, the IDE for MongoDB - https://studio3t.com/

);

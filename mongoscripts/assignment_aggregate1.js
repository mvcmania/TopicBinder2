db.sorguHavuzu.aggregate(

	// Pipeline
	[
		// Stage 1
		{
			$match: {
			 "project":"apl05"
			}
		},

		// Stage 2
		{
			$group: {
			  _id: "$topic_id"
			}
		},

		// Stage 3
		{
			$lookup: {
			    from: "atamalar",
			    localField: "_id",
			    foreignField: "topic_id",
			    as: "assigns"
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
			    path : "$assigns",
			    includeArrayIndex : "arrayIndex", // optional
			    preserveNullAndEmptyArrays : true // optional
			}
		},

		// Stage 5
		{
			$group: {
			 _id :"$_id",
			 count:{
			 	$sum:1
			 },
			 project :{
			  $first : "$assigns.project"
			 },
			 relatedCount :{
			 	$sum: {
			      $cond: [{
			         $eq: ['$assigns.is_related', 1]
			      }, 1, 0]
			   }
			 },
			  notRelatedCount :{
			 	$sum: {
			      $cond: [{
			         $eq: ['$assigns.is_related', 2]
			      }, 1, 0]
			   }
			 },
			 notStartedCount :{
			 	$sum: {
			      $cond: [{
			         $eq: ['$assigns.is_related', 0]
			      }, 1, 0]
			   }
			 }
			}
		},

		// Stage 6
		{
			$project: {
			    topic :"$_id",
			    count :"$count",
			    project :"$project",
			    remains : {
			      $subtract :[
			       { $add : ["$relatedCount","$notRelatedCount","$notStartedCount"]},"$count"
			      ]
			    },
			    relatedCount : "$relatedCount",
			    notRelatedCount : "$notRelatedCount",
			    notStartedCount :"$notStartedCount"
			}
		},

		// Stage 7
		{
			$project: {
			   topic :"$topic",
			   project: "$project",
			   count :"$count",
			   remains :"$remains",
			   relatedCount :"$relatedCount",
			   notRelatedCount :"$notRelatedCount",      
			   notStartedCount :"$notStartedCount",    
			   status :{
			    $cond:[{$eq:["$remains",0]},
			    	"green",
			     	{
			     	  $cond:[{ $eq:["$remins","$count"]},
			     		"red",
			     		"yellow"
			     	 ]
			     	}
			    ]
			   }     
			}
		},

	]

	// Created with Studio 3T, the IDE for MongoDB - https://studio3t.com/

);

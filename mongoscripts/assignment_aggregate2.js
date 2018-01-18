db.sorguHavuzu.aggregate(

	// Pipeline
	[
		// Stage 1
		{
			$match: {
			    "project":"turkishtrack"
			}
		},

		// Stage 2
		{
			$group: {
			    _id :"$topic_id",
			    actualCount:{
			        $sum:1
			    },
			    projects: {
			        $addToSet : "$project"
			    }
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
		},

		// Stage 4
		{
			$unwind: {
			    path : "$assigns",
			    preserveNullAndEmptyArrays : true
			}
		},

		// Stage 5
		{
			$group: {
			    _id :"$_id",
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
			            $eq: ['$assigns.is_related', 0]
			        }, 1, 0]
			    }
			    },
			    notStartedCount :{
			        $sum: {
			        $cond: [{
			            $eq: ['$assigns.is_related', 2]
			        }, 1, 0]
			    }
			    }
			}
		},

		// Stage 6
		{
			$project: {
			    topic :"$_id",
			    project :"$project",
			    remains : {
			      /* $cond:[{$eq :["$assignCount",0]},
			        0,
			        { */$subtract :[
			            "$actualCount",{ $add : ["$relatedCount","$notRelatedCount","$notStartedCount"]}
			        ]/* }
			      ] */
			    },
			    inProgressCount : {
			        $add : ["$relatedCount","$notRelatedCount"]
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
			   project :"$project",
			   count :"$actualCount",
			   remains :"$remains",
			   relatedCount :"$relatedCount",
			   notRelatedCount :"$notRelatedCount",      
			   notStartedCount :"$notStartedCount",    
			   status :{
			    $cond:[{$eq:["$inProgressCount","$count"]},
			        "bg-green",
			         {
			           $cond:[{ $or:[{$eq:["$notStartedCount","$count"]},{$eq:["$remains","$count"]}]},
			             "bg-red",
			             "bg-yellow"
			          ]
			         }
			    ]
			   }     
			}
		},

	]

	// Created with Studio 3T, the IDE for MongoDB - https://studio3t.com/

);

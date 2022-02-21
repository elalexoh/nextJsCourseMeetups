import { MongoClient, ObjectId } from "mongodb";
import { Fragment } from "react";
import Head from "next/head";
import MeetupDetail from "../../components/meetups/MeetupDetail";

const MeetupDetails = (props) => {
	console.debug(props.meetupData);
	return (
		<Fragment>
			<Head>
				<title> {props.meetupData.title} </title>
				<meta name="description" content={props.meetupData.description} />
			</Head>
			<MeetupDetail
				image={props.meetupData.image}
				title={props.meetupData.title}
				description={props.meetupData.description}
				address={props.meetupData.address}
			/>
		</Fragment>
	);
};

export async function getStaticPaths() {
	const client = await MongoClient.connect("mongodb://localhost:27017/meetups");
	const db = client.db();
	const meetupsCollection = db.collection("meetups");

	const meetups = await meetupsCollection.find({}, { _id: 1 }).toArray();

	client.close();

	return {
		fallback: "blocking", // if a new path wait until data loaded (dont show empty page)
		// fallback: true, // if a new path show empty page until data loaded
		// fallback: false, // if not in list return 404

		paths: meetups.map((meetup) => ({
			params: { meetupId: meetup._id.toString() },
		})),
		// paths: [
		// 	{
		// 		params: {
		// 			meetupId: "m1",
		// 		},
		// 	},
		// 	{
		// 		params: {
		// 			meetupId: "m2",
		// 		},
		// 	},
		// ],
	};
}
export async function getStaticProps(context) {
	// fetch data for a single meetiup

	const meetupId = context.params.meetupId;

	const client = await MongoClient.connect("mongodb://localhost:27017/meetups");
	const db = client.db();
	const meetupsCollection = db.collection("meetups");

	// {_id: ObjectId('58f8085dc1840e050034d98f')}
	// {"_id":{"$oid":"58f8085dc1840e050034d98f"}}
	const selectedMeetup = await meetupsCollection.findOne({
		_id: ObjectId(meetupId),
	});
	console.debug(selectedMeetup);

	client.close();
	return {
		props: {
			meetupData: JSON.parse(
				JSON.stringify({
					id: selectedMeetup._id.toString(),
					title: selectedMeetup.data.title,
					description: selectedMeetup.data.description,
					address: selectedMeetup.data.address,
					image: selectedMeetup.data.image,
				})
			),
			// meetupData: {
			// 	id: selectedMeetup._id.toString(),
			// 	title: selectedMeetup.title,
			// 	description: selectedMeetup.description,
			// 	address: selectedMeetup.address,
			// 	image: selectedMeetup.image,
			// },
		},
	};
}
export default MeetupDetails;

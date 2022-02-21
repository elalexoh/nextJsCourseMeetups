// import { useEffect } from "react";
import { MongoClient } from "mongodb";
import Head from "next/head";
import { Fragment } from "react";

import MeetupList from "../components/meetups/MeetupList";

const DUMMY_MEETUPS = [
	{
		id: "m1",
		title: "A First Meetup",
		image: "http://placehold.it/500",
		address:
			"Lorem ipsum dolor sit amet consectetur adipisicing elit. Quo officiis rem aperiam id expedita cum dolore eveniet optio alias ab, assumenda dolores ullam quod autem? Voluptatum dignissimos assumenda et eos?",
	},
	{
		id: "m2",
		title: "A Second Meetup",
		image: "http://placehold.it/500",
		address:
			"Lorem ipsum dolor sit amet consectetur adipisicing elit. Quo officiis rem aperiam id expedita cum dolore eveniet optio alias ab, assumenda dolores ullam quod autem? Voluptatum dignissimos assumenda et eos?",
	},
];

const HomePage = (props) => {
	// const [loadedMeetup, setLoadedMeetup] = useState([]);
	// useEffect(() => {
	// 	// send http request and fetch data
	// 	setLoaded(DUMMY_MEETUPS);
	// }, []);

	return (
		<Fragment>
			<Head>
				<title>Reacts Meetups</title>
				{/* google description */}
				<meta name="description" content="Lorem ipsum" />
			</Head>
			<MeetupList meetups={props.meetups} />;
		</Fragment>
	);
};

// //?? Server side render
// export async function getServerSideProps(context) {
// 	const req = context.req;
// 	const res = context.res;

// 	// Fetch data from API
// 	return {
// 		props: {
// 			meetups: DUMMY_MEETUPS, //emulate props
// 		},
// 	};
// }

// ?? Static generation (AFTER BUILD)
export async function getStaticProps() {
	const client = await MongoClient.connect("mongodb://localhost:27017/meetups");
	const db = client.db();
	const meetupsCollection = db.collection("meetups");

	const meetups = await meetupsCollection.find().toArray();

	client.close();

	// Fetch data from API
	return {
		props: {
			meetups: meetups.map((meetup) => ({
				id: meetup._id.toString(),
				title: meetup.data.title,
				address: meetup.data.address,
				image: meetup.data.image,
			})),
		},
		revalidate: 1, //updated every 1sec
	};
}
export default HomePage;

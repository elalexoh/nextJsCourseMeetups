import NewMeetupForm from "../../components/meetups/NewMeetupForm";
import Head from "next/head";
import { useRouter } from "next/router";
import { Fragment } from "react";

const NewMeetupPage = (props) => {
	const router = useRouter();
	const onAddMeetupHandler = async (enteredMeetupData) => {
		const response = await fetch("/api/new-meetup", {
			method: "POST",
			body: JSON.stringify(enteredMeetupData),
			headers: {
				"Content-Type": "application/json",
			},
		});

		const data = await response.json();

		console.debug(data);

		router.push("/");
	};

	return (
		<Fragment>
			<Head>
				<title>Add a New Meetup</title>
				<meta name="description" content="lorem ipsum" />
			</Head>
			<NewMeetupForm onAddMeetup={onAddMeetupHandler} />
		</Fragment>
	);
};
export default NewMeetupPage;

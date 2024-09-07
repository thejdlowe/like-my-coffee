import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import { useAppContext } from "../../../../../../helpers/context";
export const CurrentUsbReceiverConnectedStatusIndicator = () => {
	const { currentUsbReceiverConnectedStatus } = useAppContext();
	let status;
	if (currentUsbReceiverConnectedStatus) {
		status = <CheckCircleIcon color="success" />;
	} else {
		status = <ErrorIcon color="error" />;
	}

	return <div>USB Status: {status}</div>;
};

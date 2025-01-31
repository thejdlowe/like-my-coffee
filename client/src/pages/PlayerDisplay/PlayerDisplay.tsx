import { useParams } from 'react-router';

export const PlayerDisplay = () => {
    const {id} = useParams();
    return (<>{id}</>)
}
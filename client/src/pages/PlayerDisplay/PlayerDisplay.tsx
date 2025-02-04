import { useParams } from 'react-router';
import { DefaultPlayerDisplay } from './components';

export const PlayerDisplay = () => {
    const {id} = useParams();
    if(!id) return(<DefaultPlayerDisplay />);
    return (<>{id}</>)
}